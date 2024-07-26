const { MailTemplate } = require("../Mail/MailTemplate.js");
const {
    getLeetcodeData,
    getCodeforcesData,
    getCodechefData,
} = require("../RefreshData/index.js");
const { cloudinary } = require("../cloudinary/index.js");
const Otp = require("../models/Otp.js");
const UpContest = require("../models/UpContest.js");
const FRequest = require("../models/fRequests.js");
const User = require("../models/user.js");
const { transporter } = require("../utils/Mailer.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const calcAggregateRating = require("../utils/calcAggregateRating.js");
const ErrorHand = require("../utils/errorHand.js");
const sendjwtToken = require("../utils/sendjwtToken");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')




/////////////////// Auth ////////////////////////

module.exports.register = async (req, res, next) => {
    const { email, password, otp } = req.body;

    if (!(email || password || otp)) {
        return next(new ErrorHand("All fields are  required", 400));
    }

    const record = await Otp.findOne({ email });

    if (!record || (record?.expiresAt < new Date())) {
        return next(new ErrorHand("Invalid or expired OTP", 401));
    }

    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
        return next(new ErrorHand("Invalid  OTP", 401));
    }

    await Otp.deleteOne({ _id: record._id });


    //  email-checked , otp-verified

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        password: hash,
    });
    await user.save();

    sendjwtToken(user, 201, res);
};

module.exports.sendOtp = async (req, res, next) => {
    const { email } = req.body;


    const foundUser = await User.findOne({ email });

    if (foundUser) {
        return res.status(200).json({
            success: false,
            message: "Email already in use",
        });
    }




    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRY * 1000);

    await Otp.deleteMany({ email }); //delete all previously generated otp - if user resend otp

    await Otp.create({ email, otp, expiresAt });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER, // sender address
            to: email, // recipient address
            subject: `Your OTP Code is ${otp}`, // subject line
            html: MailTemplate(otp)
        });
        res.status(200).json({
            success: true,
            message: "verification code  sent to your email"
        })
        // console.log('OTP email sent');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({
            success: false,
            message: "something went wrong while sending mail"
        })
    }

}

module.exports.completeProfile = async (req, res, next) => {
    const {
        username,
        name,
        college = "",
        lc,
        cf,
        cc,
        linkedin = "",
        github = "",
        twitter = "",
    } = req.body;

    const lowUsername = username.toLowerCase();

    const availableUser = await User.findOne({ username: lowUsername });
    if (availableUser) {
        return next(new ErrorHand("username is not available", 400));
    }

    let lcData, cfData, ccData;
    if (lc && lc?.trim().length > 0) {
        const data = await getLeetcodeData(lc.trim());
        if (data && !data.success && data.error) {
            return res.status(404).json({
                success: false,
                message: data.error,
            })
        }
        lcData = data;
    }
    if (cf && cf?.trim().length > 0) {
        const data = await getCodeforcesData(cf.trim());
        if (data && !data.success && data.error) {
            return res.status(404).json({
                success: false,
                message: data.error,
            })
        }
        cfData = data;
    }
    if (cc && cc?.trim().length > 0) {
        const data = await getCodechefData(cc?.trim());
        if (data && !data.success && data.error) {
            return res.status(404).json({
                success: false,
                message: data.error,
            })
        }
        ccData = data;
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { username: lowUsername, name, college, linkedin, github, twitter, lc: lcData, cf: cfData, cc: ccData },
        { new: true }
    );

    if (req.file) {
        if (req.user?.avatar?.filename)
            await cloudinary.uploader.destroy(req.user?.avatar.filename);

        user.avatar = {
            url: req.file?.path || "",
            filename: req.file?.filename || "",
        };
    }


    user.aggregateRating = calcAggregateRating(user);
    await user.save();

    res.status(200).json({
        status: "success",
        user,
        message: "profile completed",
    });
};

module.exports.login = async (req, res, next) => {
    const { userDetails, password } = req.body;

    if (!userDetails) {
        return next(new ErrorHand("Email or Username is required", 400));
    }

    const user = await User.findAndValidate(userDetails, password);

    if (!user) {
        return next(new ErrorHand("Invalid email or password", 404));
    }
    sendjwtToken(user, 200, res);
};

module.exports.logout = async (req, res, next) => {
    // let options = {
    //     expires: new Date(Date.now()),
    //     httpOnly: true,
    //     // secure: process.env.NODE_ENV === 'production', // Set to true in production
    //     // sameSite: 'None'
    // }
    // if (process.env.NODE_ENV === 'production') {
    //     options = {
    //         ...options,
    //         secure: true,
    //         sameSite: 'None'
    //     }
    // }
    // res.cookie("token", null, options);
    res.status(200).json({
        status: true,
        message: "Logged Out",
        // token: null,
        // cookieOptions: options,
    });
};

module.exports.changePassword = async (req, res, next) => {
    const { oldpw, newpw } = req.body;
    //current logged in userdetails
    // console.log(req.user);

    if (!oldpw.trim()) {
        if (!(req.user.googleId)) {
            return next(new ErrorHand("Old Password required", 401));
        }
    }
    else {
        const result = await bcrypt.compare(oldpw, req.user?.password);
        if (!result) {
            return next(new ErrorHand("Incorrect Password", 401));
        }
    }

    // const result = await bcrypt.compare(oldpw, req.user?.password);
    // if (!result) {
    //     return next(new ErrorHand("Password incorrect", 401));
    // } else {
    const hash = await bcrypt.hash(newpw, 12);
    await User.findByIdAndUpdate(
        req.user?._id,
        { password: hash },
        { new: true }
    );
    res.status(200).json({
        success: true,
        message: "Password Changed!",
    });
    // }
};

//   module.exports.forgotPassword =catchAsync( async (req, res) => {
//     const { oldpw,newpw } = req.body;
//     //current logged in userdetails
//     const user = await User.findOne({  username });
//     const result = await bcrypt.compare(oldpw , user.password);
//     if(!result){
//         //oldpw  doesn't match
//     }else{
//         const hash = await bcrypt.hash(newpw, 12);
//         await User.findOneAndUpdate({password:hash});
//     }

//   });

module.exports.setUsername = async (req, res, next) => {
    const { lc, cc, cf } = req.body;
    if (
        (lc && lc.username?.trim().length === 0) ||
        (cc && cc.username?.trim().length === 0) ||
        (cf && cf.username?.trim().length === 0)
    ) {
        return next(new ErrorHand("username is required"));
    }
    const lcData = await getLeetcodeData(lc?.username?.trim());
    if (lcData && !lcData.success && lcData.error) {
        return res.status(404).json({
            success: false,
            message: lcData.error,
        })
    }

    const cfData = await getCodeforcesData(cf?.username?.trim());
    if (cfData && !cfData.success && cfData.error) {
        return res.status(404).json({
            success: false,
            message: cfData.error,
        })
    }


    const ccData = await getCodechefData(cc?.username?.trim());
    if (ccData && !ccData.success && ccData.error) {
        return res.status(404).json({
            success: false,
            message: ccData.error,
        })
    }

    req.user.lc = lcData;
    req.user.cf = cfData;
    req.user.cc = ccData;

    req.user.aggregateRating = calcAggregateRating(req.user);

    await req.user.save();

    res.status(200).json({
        status: true,
        message: "Username updated",
        user: req.user,
    });
};


///////////////////////  Search  ////////////////////////////

module.exports.userDetails = async (req, res, next) => {
    const apiFeatures = new ApiFeatures(User.find(), req.query).search();
    const users = await apiFeatures.query;
    res.status(201).json({
        status: true,
        users,
    });
};


///////////////////// Follow ////////////////////////////////

module.exports.sendFollowRequest = async (req, res, next) => {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('fRequests', 'sender');//reciever



    if (!user) {
        return next(new ErrorHand("user not found", 404));
    }

    if (userId === req.user._id) {
        return next(new ErrorHand("can't send follow request to yourself", 401));
    }

    const pendingrequest = user.fRequests.some(fr => fr.sender.toString() === req.user?._id.toString());
    if (pendingrequest) {
        return next(new ErrorHand("already sent Follow request", 400));
    }
    if (user.follower.some((el) => el.toString() === req.user._id.toString())) {
        return next(new ErrorHand("already a follower", 400));
    }

    const fRequest = new FRequest({
        sender: req.user._id,
        reciever: userId,
    });
    user.fRequests.push(fRequest);
    await fRequest.save();
    await user.save();

    res.status(200).json({
        success: true,
        fRequest,
    });
};

module.exports.withdrawRequest = async (req, res, next) => {
    const { userId } = req.body;

    const frequest = await FRequest.findOneAndDelete({ sender: req.user._id, reciever: userId });
    await User.findByIdAndUpdate(userId, { $pull: { fRequests: frequest?._id } });


    res.status(200).json({
        success: true,
        msg: "Request removed"
    })

}

module.exports.acceptFollowRequest = async (req, res, next) => {
    const { reqId } = req.body;

    const frequest = await FRequest.findById(reqId);

    if (!frequest) {
        return next(new ErrorHand("invalid request", 400))
    }

    if (req.user._id.toString() !== frequest?.reciever.toString()) {
        return next(new ErrorHand("You have not authorized to do this", 401));
    }

    const user = await User.findByIdAndUpdate(frequest?.sender, { $push: { following: req.user } }, { new: true }); //sender or follower
    req.user.follower.push(user);

    req.user.fRequests = req.user?.fRequests.filter((el) => el.toString() !== reqId.toString());
    await req.user.save();


    await FRequest.findByIdAndDelete(reqId);

    res.status(200).json({
        status: true,
        msg: `${frequest.senderusername} was added as a follower`,
        curr_user: req.user
    });
};

module.exports.rejectFollowRequest = async (req, res, next) => {
    const { reqId } = req.body;

    const frequest = await FRequest.findById(reqId);
    if (!frequest) {
        return next(new ErrorHand("invalid request", 400))
    }

    if (req.user._id.toString() !== frequest?.reciever.toString()) {
        return next(new ErrorHand("You have not authorized to do this", 401));
    }

    // const curr_user = await User.findByIdAndUpdate(req.user._id, { $pull: { fRequests: reqId } }, { new: true });

    req.user.fRequests = req.user?.fRequests.filter(fr => fr.toString() !== reqId.toString());
    await req.user.save();

    await FRequest.findByIdAndDelete(reqId);

    res.status(200).json({
        status: true,
        msg: `Request rejected`,
        curr_user: req.user
    });
};

module.exports.unFollow = async (req, res, next) => {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { $pull: { follower: req.user?._id } }, { new: true });

    const curr_user = await User.findByIdAndUpdate(
        req.user?._id,
        { $pull: { following: user?._id } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        msg: `you unfollow ${user.username}`,
        curr_user
    })



}

module.exports.getReqeusts = async (req, res, next) => {
    await req.user.populate({
        path: 'fRequests',
        populate: {
            path: 'sender',
            select: 'name username avatar'
        }
    });



    const frequests = req.user.fRequests.map((item) => {
        return {
            _id: item._id,//reqId
            sender: item.sender,
            isfollowing: req.user.following.some((el) => el.toString() === item.sender._id.toString())
        }
    })

    res.status(200).json({
        status: true,
        frequests
    })

}


////////////////////// Profile   //////////////////////

module.exports.profile = async (req, res, next) => {
    const { username } = req.params;
    const lowUsername = username.toLowerCase();

    const user = await User.findOne({ username: lowUsername }).populate('fRequests', 'sender');

    if (!user) {
        return res.status(200).json({
            status: false,
            msg: "user not found"
        })
    }

    const isrequested = user?.fRequests?.some((fr) => fr.sender.toString() === req.user?._id.toString());
    const isfollowing = user?.follower.some((el) => el.toString() === req.user._id.toString());

    res.status(200).json({
        status: true,
        user,
        isrequested,
        isfollowing
    })
};


module.exports.updateProfile = async (req, res, next) => {
    const {
        name,
        // username,
        college,
        // email,
        lc,
        cf,
        cc,
        linkedin,
        github,
        twitter,

    } = req.body;


    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name,
            //   username,
            college,
            //   email,
            linkedin,
            github,
            twitter,
        },
        { new: true }
    );


    if (!user.lc || user.lc?.username !== lc?.trim()) {
        if (lc?.trim().length > 0) {

            const data = await getLeetcodeData(lc.trim());
            if (data && !data.success && data.error) {
                return res.status(404).json({
                    success: false,
                    error: data.error,
                })
            }
            user.lc = data;
        } else {
            user.lc = null;
        }


    }
    if (!user.cf || user.cf?.username !== cf?.trim()) {
        if (cf?.trim().length > 0) {

            const data = await getCodeforcesData(cf.trim());
            if (data && !data.success && data.error) {
                return res.status(404).json({
                    success: false,
                    error: data.error,
                })
            }
            user.cf = data;
        } else {
            user.cf = null;
        }

    }
    if (!user.cc || user.cc?.username !== cc?.trim()) {
        if (cc?.trim().length > 0) {
            const data = await getCodechefData(cc.trim());
            if (data && !data.success && data.error) {
                return res.status(404).json({
                    success: false,
                    error: data.error,
                })

            }
            user.cc = data;

        } else {
            user.cc = null;
        }

    }

    user.aggregateRating = calcAggregateRating(user);

    await user.save();

    res.status(200).json({
        success: true,
        message: "profile updated",
        user,
    });
};

module.exports.editAvatar = async (req, res, next) => {
    if (req.user?.avatar?.filename)
        await cloudinary.uploader.destroy(req.user?.avatar.filename);

    if (req.file) {
        req.user.avatar = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await req.user.save();
    }
    res.status(200).json({
        success: true,
        message: "user avatar updated",
        user: req.user,
    });
};

module.exports.changeUsername = async (req, res, next) => {
    const { username, save } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            msg: "username is required"
        })
    }
    const lowUsername = username.toLowerCase();

    const user = await User.findOne({ username: lowUsername });

    if (user) {
        return res.status(200).json({
            success: false,
            msg: "username is already taken"
        })
    } else {
        if (save) {
            if (req.user?.usernameChanged) {
                return res.status(400).json({
                    success: false,
                    msg: "change username limit crossed"
                })
            } else {
                req.user.username = lowUsername;
                req.user.usernameChanged = true;
                await req.user.save();

                return res.status(200).json({
                    success: true,
                    msg: "username updated successfully",
                    user: req.user
                })
            }
        } else {
            res.status(200).json({
                success: true,
                msg: "unique username",
                isnormal: username.length <= 18,
            })
        }
    }


}

module.exports.getFollowDetails = async (req, res, next) => {
    await req.user.populate('follower', '_id name username avatar');
    await req.user.populate('following', '_id name username avatar');

    return res.status(200).json({
        success: true,
        user: req.user,
    })
}

module.exports.dashboard = async (req, res, next) => {
    const allContests = await UpContest.find().sort({ startTime: 1 }); //we can't store documents in sorted manner
    // in mongodb but while retrieving we can sort them
    const LcContests = allContests.filter(item => item.platform === "lc");
    const CfContests = allContests.filter(item => item.platform === "cf");
    const CcContests = allContests.filter(item => item.platform === "cc");
    return res.status(200).json({
        success: true,
        user: req.user,
        allContests,
        CcContests,
        LcContests,
        CfContests
    })
}

module.exports.landing = async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        activeUsers: users?.length,
    })
}
