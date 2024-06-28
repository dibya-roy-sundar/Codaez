const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const ErrorHand = require('./errorHand.js');


module.exports.isLoggedIn = async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return next(new ErrorHand("You need to log in first",401));
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(data.id);

    next();
}

