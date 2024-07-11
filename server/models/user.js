const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        // required: [true, "Name is Required"],
    },
    username: {
        type: String,
        required: [true, "Username is Required"],
        unique: true,
        indexing: true,
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
    avatar: {
        url: String,
        filename: String,
    },
    college: {
        type: String,
    },
    lc: {
        username: String,
        rating: Number,
        rank: Number,
        topPercentage: Number,
        badge: String,
        attendedContestsCount: Number,
        totalquestions: Number,
        easyquestions: Number,
        mediumquestions: Number,
        hardquestions: Number,
    },
    cf: {
        username: String,
        rating: Number,
        rank: String,
        maxRating: Number,
        maxRank: String,
    },
    cc: {
        username: String,
        rating: Number,
        rank: Number,
        maxRating: Number,
        countryRank: Number,
        stars: String,
    },
    aggregateRating: {
        type:Number
    },
    gfg: {
        type: String,
    },
    hr: {
        //hackerrank
        type: String,
    },
    linkedin: {
        type: String,
    },
    github: {
        type: String,
    },
    twitter: {
        type: String,
    },
    hashnode: {
        type: String,
    },
    medium: {
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
    ],
    usernameChanged:{
        type:Boolean,
        default:false,
    }
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

userSchema.statics.findAndValidate = async function (email, username, password) {
    const foundUser = await this.findOne(
        {
            $or: [{ username }, { email }]
        }
    ).select("+password");
    //if a user is found, this means that the username is already in use
    if (!foundUser) return false;

    //if username is unique, then we will verify the password
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

const User = mongoose.model("User", userSchema);
module.exports = User;