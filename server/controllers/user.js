const {
    getLeetcodeData,
    getCodeforcesData,
    getCodechefData,
} = require("../RefreshData/index.js");
const { cloudinary } = require("../cloudinary/index.js");
const FRequest = require("../models/frequests.js");
const User = require("../models/user.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const calcAggregateRating = require("../utils/calcAggregateRating.js");
const ErrorHand = require("../utils/errorHand.js");
const sendjwtToken = require("../utils/sendjwtToken");
const bcrypt = require("bcrypt");



/////////////////// Auth ////////////////////////

module.exports.register = async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email || password)) {
        return next(new ErrorHand("All fields are  required", 400));
    }

    const foundUser = await User.findOne({ email });

    if (foundUser) {
        return res.status(200).json({
            success: true,
            error: "Email already in use",
        });
    }

    // const availableUser = await User.findOne({ username });
    // if (availableUser) {
    //     return res.status(200).json({
    //         success: true,
    //         error: "username already taken",
    //     });
    // }

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        // username,
        email,
        password: hash,
    });
    await user.save();

    sendjwtToken(user, 201, res);
};

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
        hashnode = "",
        medium = "",
    } = req.body;

    if (!(username)) {
        return next(new ErrorHand("Username is required", 400));
    }

    const availableUser = await User.findOne({ username });
    if (availableUser) {
        return res.status(200).json({
            success: true,
            message: "Username already taken",
        });
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { username, name, college, linkedin, github, twitter, hashnode, medium },
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

    if (lc && lc.length > 0) {
        user.lc.username = lc;
        user.lc = await getLeetcodeData(res, lc);
    }
    if (cf && cf.length > 0) {
        user.cf.username = cf;
        user.cf = await getCodeforcesData(res, cf);
    }
    if (cc && cc.length > 0) {
        user.cc.username = cc;
        user.cc = await getCodechefData(res, cc);
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
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        status: true,
        message: "Logged Out",
    });
};

module.exports.changePassword = async (req, res, next) => {
    const { oldpw, newpw } = req.body;
    //current logged in userdetails
    // console.log(req.user);

    const result = await bcrypt.compare(oldpw, req.user?.password);
    if (!result) {
        return next(new ErrorHand("Password incorrect", 401));
    } else {
        const hash = await bcrypt.hash(newpw, 12);
        await User.findOneAndUpdate(
            { username: req.user?.username },
            { password: hash }
        );
        res.status(200).json({
            success: true,
            message: "Password successfully changed",
        });
    }
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

    req.user.lc = await getLeetcodeData(lc?.username);
    req.user.cf = await getCodeforcesData(cf?.username);
    req.user.cc = await getCodechefData(cc?.username);

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

    const user = await User.findOne({ username: username }).select("-passsword").populate('fRequests', 'senderusername');

    if (!user) {
        return res.status(404).json({
            status: false,
            msg: "user not found"
        })
    }

    const isrequested = user?.fRequests?.some((fr) => fr.senderusername === req.user?.username);
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
        hashnode,
        medium,
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
            hashnode,
            medium,
        },
        { new: true }
    );
    if (lc.length > 0) {
        user.lc.username = lc
    }
    if (cf.length > 0) {
        user.cf.username = cf
    }
    if (cc.length > 0) {
        user.cc.username = cc
    }

    user.lc = await getLeetcodeData(res, user?.lc?.username);
    user.cf = await getCodeforcesData(res, user?.cf?.username);
    user.cc = await getCodechefData(res, user?.cc?.username);

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

    const user = await User.findOne({ username });

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
                req.user.username = username;
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
                msg: "unique username"
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

