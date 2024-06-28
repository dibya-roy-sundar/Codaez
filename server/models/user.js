const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    username: {
        type: String,
        required: [true, "Username is Required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    lc: {
        type: String,
    },
    cf: {
        type: String,
    },
    gfg: {
        type: String,
    },
    hr: {
        //hackerrank
        type: String,
    },
    cc: {
        //codechef
        type: String,
    },
    follower: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    fRequests: [
        {
            type: Schema.Types.ObjectId,
            ref: "FRequest",
        },
    ]
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

userSchema.statics.findAndValidate = async function (email, password) {
    const foundUser = await this.findOne({ email }).select("+password");
    //if a user is found, this means that the username is already in use
    if (!foundUser) return false;

    //if username is unique, then we will verify the password
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

const User = mongoose.model("User", userSchema);
module.exports = User;