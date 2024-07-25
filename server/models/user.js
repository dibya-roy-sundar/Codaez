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
        // required: [true, "Username is Required"],
        unique: true,
        index:true,
        sparse: true // This ensures that the unique index only applies to non-null values
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    googleId: {
        type: String,
    },
    password: {
        type: String,
        // required: [true, "Password is required"],
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
        contestParticipation: [
            {
                title: String,
                time: Number,
                trendDirection: String,
                problemsSolved: Number,
                totalProblems: Number,
                rating: Number,
                rank: Number,
            }
        ]
    },
    cf: {
        username: String,
        rating: Number,
        rank: String,
        maxRating: Number,
        maxRank: String,
        totalSuccessfullSubmissions:Number,
        ratingWiseProblems:[
            {
                rating:Number,
                count:Number
            }
        ],
        contestParticipation:[
            {   
                title:String,
                time:Number,
                rank:Number,
                // oldRating:Number,
                // newRating:Number,
                rating: Number
            }
        ]
    },
    cc: {
        username: String,
        rating: Number,
        rank: Number,
        maxRating: Number,
        countryRank: Number,
        stars: String,
        totalProblemSolved:Number,
        contestParticipation:[
            {
                title: String,
                year: Number,
                month: Number,
                date: Number,
                rating: Number,
                rank: Number,
            }
        ]
    },
    aggregateRating: {
        type:Number
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
    usernameChanged: {
        type: Boolean,
        default: false,
    }
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

userSchema.statics.findAndValidate = async function (userDetails, password) {
    const foundUser = await this.findOne(
        {
            $or: [{ username: userDetails.toLowerCase() }, { email: userDetails }]
        }
    ).select("+password");
    //if a user is found, this means that the username is already in use
    if (!foundUser) return false;
    if(!foundUser.password) return false;
    //if username is unique, then we will verify the password
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

const User = mongoose.model("User", userSchema);
module.exports = User;