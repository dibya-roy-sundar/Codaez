const User = require('../models/user');
const ErrorHand = require('../utils/errorHand');

module.exports.getUserDetails = async (req, res, next) => {
    const { platform } = req.params;


    if (platform === 'codeforces') {
        const username = req.user.cf?.username;
        if (!username) {
            return next(new ErrorHand("pls add your codeforces username", 400))
        }
        res.status(200).json({
            status: true,
            result: req.user.cf
        })

    }
    else if (platform === 'leetcode') {

        const username = req.user.lc?.username;
        if (!username) {
            return next(new ErrorHand("pls add your leetcode username", 400))
        }
        res.status(200).json({
            status: true,
            result: req.user.lc
        })


    }
    else if (platform === 'codechef') {
        const username = req.user.cc.username;
        if (!username) {
            return next(new ErrorHand("pls add your codechef username", 400))
        }
        res.status(200).json({
            status: true,
            result: req.user.cc
        })
    }
    else {
        res.status(500).json({
            status: false,
            message: "platform is not available"
        })
    }

}

module.exports.getLeaderboardDetails = async (req, res) => {
    const user = await User.findById(req.user._id).populate('following')

    const followingDetails = user.following.map((item) => {
        return {
            username: item.username,
            name: item.name,
            imgUrl: item.avatar.url,
            lc: item.lc,
            cf: item.cf,
            cc: item.cc,
            aggregateRating: item.aggregateRating
        }
    })
    const currUserDetails = {
        username: user.username,
        name: user.name,
        imgUrl: user.avatar.url,
        lc: user.lc,
        cf: user.cf,
        cc: user.cc,
        aggregateRating: user.aggregateRating
    }

    res.status(200).json({
        status: true,
        result: {
            leaderboard: [...followingDetails, currUserDetails],
            currUserDetails
        }
    })

}