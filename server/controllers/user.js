const FRequest = require('../models/frequests.js');
const User = require('../models/user.js');
const ApiFeatures = require('../utils/apiFeatures.js');
const ErrorHand = require('../utils/errorHand.js');
const sendjwtToken = require('../utils/sendjwtToken');
const bcrypt = require('bcrypt');
const mongoose=require('mongoose')

module.exports.register = async (req, res) => {
    const { username, name, email, password } = req.body;

    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
        return res.status(200).json({
            success: true,
            error: "Email already in use"
        })
    }

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        name,
        email,
        password: hash
    });
    await user.save();

    sendjwtToken(user, 201, res);
};

module.exports.login = async (req, res, next) => {
    const { username,email, password } = req.body;

    if(!(username || email)){
        return next(new ErrorHand("Email or Username is required",400))
    }



    const user = await User.findAndValidate(email,username, password);

    if (!user) {
        return next(new ErrorHand("Invalid email or password", 404));
    }

    sendjwtToken(user, 200, res);
}

module.exports.logout = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        status: true,
        message: "Logged Out",
    });
}


module.exports.changePassword = async (req, res, next) => {
    const { oldpw, newpw } = req.body;
    //current logged in userdetails
    // console.log(req.user);

    const result = await bcrypt.compare(oldpw, req.user.password);
    if (!result) {
        return next(new ErrorHand("Password incorrect", 401));
    } else {
        const hash = await bcrypt.hash(newpw, 12);
        await User.findOneAndUpdate({ username: req.user.username }, { password: hash });
        res.status(200).json({
            status: true,
            message: "Password successfully changed",
        })
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
    req.user = await User.findOneAndUpdate({ username: req.user.username }, { ...req.body }, { new: true });
    res.status(200).json({
        status: true,
        message: "Username updated",
        user: req.user,
    })
}

module.exports.userDetails = async (req, res, next) => {
    const apiFeatures = new ApiFeatures(User.find(), req.query).search();
    const users = await apiFeatures.query;
    res.status(201).json({
        status: true,
        users
    });
}

module.exports.sendFollowRequest = async (req, res, next) => {
    // const { userId } = req.body;
    // const user = await User.findById(userId);//reciever
    
    // for testing 
    const {username}=req.body;
    if(!username){
        return next(new ErrorHand("username is required",400))
    }
    
    const user=await User.findOne({username});

    if(!user){
        return next(new ErrorHand("user not found",404));
    }

    if(user.username===req.user.username){
        return next(new ErrorHand("can't send friend request to yourself",401))
    }

    const pendingrequest=await FRequest.findOne({
        senderusername:req.user.username,
        recieverusername:user.username
    })
    if(pendingrequest){
        return next(new ErrorHand("already sent freind request",400))
    }
    if(user.follower.some((el)=> el.toString() === req.user._id.toString())){
        return next(new ErrorHand("already a follower",400));
    }
   



    const fRequest = new FRequest({
        senderusername: req.user.username,
        sendername: req.user.name,
        recieverusername:user.username,
    });
    user.fRequests.push(fRequest);
    await fRequest.save();
    await user.save();

    res.status(200).json({
        success: true,
        fRequest,
        user
    })
}

module.exports.acceptFollowRequest = async (req, res, next) => {
    const { reqId } = req.body;
    const frequest = await FRequest.findById(reqId);

    if(req.user.username!==frequest.recieverusername){
      return   next(new ErrorHand("You have not authorized to do this",401));
    }

    const user = await User.findOne({ username: frequest.senderusername }); //sender or follower
    req.user.follower.push(user);
    user.following.push(req.user);
    await user.save();
    await req.user.save();

    await User.findByIdAndUpdate(req.user._id, { $pull: { fRequests: reqId } });
    await FRequest.findByIdAndDelete(reqId);

    res.status(200).json({
        status: true,
        msg: `${frequest.sendername} was added as a follower`,
    })
}

module.exports.rejectFollowRequest = async (req, res, next) => {
    const { reqId } = req.body;

    const frequest = await FRequest.findById(reqId);
    if(req.user.username!==frequest.recieverusername){
        return   next(new ErrorHand("You have not authorized to do this",401));
      }

    await User.findByIdAndUpdate(req.user._id, { $pull: { fRequests: reqId } });
    await FRequest.findByIdAndDelete(reqId);

    res.status(200).json({
        status: true,
        msg: `Request rejected`,
    })
}