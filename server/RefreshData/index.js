const User = require("../models/user");
// const catchAsync = require("../utils/catchAsync");
// const ErrorHand = require("../utils/errorHand");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const mongoose = require('mongoose');
const calcAggregateRating = require("../utils/calcAggregateRating");

module.exports.getCodeforcesData = async (username) => {
    try {
        async function postData(url = "", data = {}) {
            const response = await fetch(url);
            return response.json();
        }

        const data = await postData(`https://codeforces.com/api/user.info?handles=${username}`)
        if (data.result) {
            const result = {
                username: data.result[0].handle,
                rating: data.result[0].rating,
                rank: data.result[0].rank,
                maxRating: data.result[0].maxRating,
                maxRank: data.result[0].maxRank,
            }
            // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cf: result } }, { new: true });
            return result;
        }
        else if (data.comment) {
            return false;
            // return next(new ErrorHand(data.comment || "data fetching error in codeforces", 500))
        }
        else {
            return false;
            // return next(new ErrorHand(data || "data fetching error in codeforces", 500))
        }
    }
    catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cf: { username } } }, { new: true })
        console.log(error);
        return false;
        // return next(new ErrorHand("error while fetching codeforces data", 500));
    }
}

module.exports.getLeetcodeData = async (username) => {
    try {
        const query = `
            query userContestRankingInfo($username: String!) {
                userContestRanking(username: $username) {
                    attendedContestsCount
                    rating
                    globalRanking
                    totalParticipants
                    topPercentage
                    badge {
                        name
                    }
                }
                userContestRankingHistory(username: $username) {
                    attended
                    trendDirection
                    problemsSolved
                    totalProblems
                    finishTimeInSeconds
                    rating
                    ranking
                    contest {
                        title
                        startTime
                    }
                }
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }`;

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({ query: query, variables: { username: username } }),
        });
        const data = await response.json();
        if (data.errors) {
            return {};
            // return next(new ErrorHand(data.errors?.message, 500))
        } else {
            // console.log(data.data);
            const result = {
                username: username,
                rating: data.data.userContestRanking.rating && Math.round(data.data.userContestRanking.rating),
                rank: data.data.userContestRanking.globalRanking,
                topPercentage: data.data.userContestRanking.topPercentage,
                badge: data.data.userContestRanking.badge,
                attendedContestsCount: data.data.userContestRanking.attendedContestsCount,
                totalquestions: data.data.matchedUser.submitStats.acSubmissionNum[0]?.count,
                easyquestions: data.data.matchedUser.submitStats.acSubmissionNum[1]?.count,
                mediumquestions: data.data.matchedUser.submitStats.acSubmissionNum[2]?.count,
                hardquestions: data.data.matchedUser.submitStats.acSubmissionNum[3]?.count,
            }
            // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { lc: result } }, { new: true });
            return result
        }
    }
    catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { lc: { username } } }, { new: true })
        console.log(error);
        return {};
        // return next(new ErrorHand("error while fetching leetcode data", 500));
    }
}

module.exports.getCodechefData = async (username) => {
    try {
        let data = await axios.get(`https://www.codechef.com/users/${username}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const result = {
            username: document.querySelector('.user-details-container')?.children[0]?.children[1]?.textContent || username,
            rating: parseInt(document.querySelector(".rating-number")?.textContent) || false,
            maxRating: parseInt(document.querySelector(".rating-number")?.parentNode?.children[4]?.textContent?.split('Rating')[1])|| false,
            rank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML)|| false,
            countryRank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML)|| false,
            stars: document.querySelector('.rating')?.textContent || "unrated",
        }
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cc: result } }, { new: true });
        return result;

    } catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cc: { username } } }, { new: true })
        console.log(error);
        console.log("error while fetching codechef data");
        return false;
        // return next()
        // return next(new ErrorHand("error while fetching codechef data",500));
    }
}

module.exports.refreshData = async () => {
    const allUsers = await User.find({}, 'cf.username lc.username cc.username');
    const updates=[];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    for (const user of allUsers) {
        const updateObj = {};
        let flag = false;
        if (user.cf && user.cf.username) {
            const data = await module.exports.getCodeforcesData(user.cf.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            if (data) {
                flag = true;
                updateObj.cf = data;
            }
        }
        if (user.lc && user.lc.username) {
            const data = await module.exports.getLeetcodeData(user.lc.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            // console.log(data)
            if (data) {
                flag = true;
                updateObj.lc = data
            }
        }
        if (user.cc && user.cc.username) {
            const data = await module.exports.getCodechefData(user.cc.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            // console.log(data)
            if (data) {
                flag = true;
                updateObj.cc = data
            }
        }
        if (flag) {
            updateObj.aggregateRating=calcAggregateRating(updateObj)
            updates.push({ _id: user._id, update: { ...updateObj } });
        }
    }

    // const results = await Promise.all(updates);
    // const filteredResults = results.filter(result => result !== null);
    // console.log(filteredResults);

    try {
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(update._id) },
                update: { $set: update.update }
            }
        }));
        // console.log(bulkOps);
        const result = await User.bulkWrite(bulkOps);
        // console.log('Bulk update result:', result);
        console.log('Bulk updated users');
    } catch (err) {
        console.error('Error:', err);
    }
}