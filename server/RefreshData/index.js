const User = require("../models/user");
// const catchAsync = require("../utils/catchAsync");
// const ErrorHand = require("../utils/errorHand");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const mongoose = require('mongoose');
const calcAggregateRating = require("../utils/calcAggregateRating");
const UpContest = require("../models/UpContest");

module.exports.getCodeforcesData = async (username) => {
    try {
        async function postData(url = "", data = {}) {
            const response = await fetch(url);
            return response.json();
        }

        const data = await postData(`https://codeforces.com/api/user.info?handles=${username}`)
        if (data.status === "FAILED") {
            console.log(data.comment);
            return {
                success: false,
                error: data.comment,
            }
        }
        const ratingdata = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
        const contestParticipation = ratingdata?.data.result.map((item) => {
            return {
                title: item.contestName,
                time: item.ratingUpdateTimeSeconds,
                rank: item.rank,
                // oldRating: item.oldRating,
                // newRating: item.newRating,
                rating: item.newRating,
            }
        })
        const problemdata = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
        const problemsSubmitted = problemdata?.data?.result;
        const problemSolved = problemsSubmitted.reduce((accumulator, problem) => {
            if (problem.verdict !== "OK") {
                return accumulator;
            }
            const rating = problem.problem.rating;
            if (!accumulator.ratingCounts[rating]) {
                accumulator.ratingCounts[rating] = 0;
            }
            accumulator.ratingCounts[rating]++;
            accumulator.totalSuccessfullSubmissions++;
            return accumulator;
        }, { ratingCounts: {}, totalSuccessfullSubmissions: 0 });

        const { ratingCounts, totalSuccessfullSubmissions } = problemSolved;
        const ratingWiseProblems = [];
        // console.log(ratingCounts); 
        for (const [rating, count] of Object.entries(ratingCounts)) {
            if (rating !== "undefined" && count !== "undefined") {
                ratingWiseProblems.push({ rating: parseInt(rating), count });
            }
        }

        if (data.result) {
            const result = {
                username: data.result[0].handle,
                rating: data.result[0].rating,
                rank: data.result[0].rank,
                maxRating: data.result[0].maxRating,
                maxRank: data.result[0].maxRank,
                contestParticipation,
                totalSuccessfullSubmissions,
                ratingWiseProblems
            }
            // console.log("cf result",result);
            // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cf: result } }, { new: true });
            return result;
        }
        else if (data.comment) {
            return {};
            // return next(new ErrorHand(data.comment || "data fetching error in codeforces", 500))
        }
        else {
            return {};
            // return next(new ErrorHand(data || "data fetching error in codeforces", 500))
        }
    }
    catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cf: { username } } }, { new: true })
        console.log(error);
        return {
            update: 'no',
        };
        // return next(new ErrorHand("error while fetching codeforces data", 500));
    }
}

module.exports.getLeetcodeData = async (username) => {
    try {
        const query = `#graphql
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
            if (!data.matchedUser) {
                console.log(data.errors);
                return {
                    success: false,
                    error: "LeetCode username not found or Server Unresponsive",
                };
            } else {
                return {};
            }
            // return next(new ErrorHand(data.errors?.message, 500))
        } else {
            // console.log(data.data);
            const contestParticipation = data?.data?.userContestRankingHistory?.filter(
                (obj) => obj?.attended === true
            )
            //   console.log(contestParticipation);
            const newContestParticipation = contestParticipation?.map((item) => {
                return {
                    title: item?.contest?.title,
                    time: item?.contest?.startTime,
                    trendDirection: item?.trendDirection,
                    problemsSolved: item?.problemsSolved,
                    totalProblems: item?.totalProblems,
                    rating: item?.rating,
                    rank: item?.ranking,
                }
            })
            const result = {
                username: username,
                rating: data?.data?.userContestRanking?.rating && Math.round(data?.data?.userContestRanking?.rating),
                rank: data?.data?.userContestRanking?.globalRanking,
                topPercentage: data?.data?.userContestRanking?.topPercentage,
                badge: data?.data?.userContestRanking?.badge?.name,
                attendedContestsCount: data?.data?.userContestRanking?.attendedContestsCount,
                totalquestions: data?.data?.matchedUser?.submitStats?.acSubmissionNum[0]?.count,
                easyquestions: data?.data?.matchedUser?.submitStats?.acSubmissionNum[1]?.count,
                mediumquestions: data?.data?.matchedUser?.submitStats?.acSubmissionNum[2]?.count,
                hardquestions: data?.data?.matchedUser?.submitStats?.acSubmissionNum[3]?.count,
                contestParticipation: newContestParticipation
            }
            // console.log("lc result",result);
            // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { lc: result } }, { new: true });
            return result
        }
    }
    catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { lc: { username } } }, { new: true })
        console.log(error);
        return {
            update: 'no',
        };
        // return next(new ErrorHand("error while fetching leetcode data", 500));
    }
}

module.exports.getCodechefData = async (username) => {
    try {
        let data = await axios.get(`https://www.codechef.com/users/${username}`);

        let allRating = data.data.search("var all_rating = ") + "var all_rating = ".length;
        let allRating2 = data.data.search("var current_user_rating =") - 6;
        let querystring = data.data.substring(allRating, allRating2);
        let ratingData = JSON.parse(querystring);
        const contestParticipation = ratingData?.map((item) => {

            return {
                title: item.name,
                year: Number(item.getyear),
                month: Number(item.getmonth),
                date: Number(item.getday),
                rating: Number(item.rating),
                rank: Number(item.rank),
            }
        })
        // console.log("cc result",contestParticipation);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const section = document.querySelector('section.rating-data-section.problems-solved');
        const problems = Array.from(section.querySelectorAll('h3')).map(h5 => h5.textContent.trim());
        const string = problems[3];
        const totalProblemSolved = parseInt(string.split(':')[1].trim());
        const result = {
            username: document.querySelector('.user-details-container')?.children[1]?.children[0]?.children[0]?.children[1]?.children[1]?.textContent || username,
            rating: parseInt(document.querySelector(".rating-number")?.textContent) || false,
            maxRating: parseInt(document.querySelector(".rating-number")?.parentNode?.children[4]?.textContent?.split('Rating')[1]) || false,
            rank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML) || false,
            countryRank: parseInt(document.querySelector('.rating-ranks')?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML) || false,
            stars: document.querySelector('.rating')?.textContent || "unrated",
            totalProblemSolved,
            contestParticipation,
        }
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cc: result } }, { new: true });
        return result;

    } catch (error) {
        // req.user = await User.findByIdAndUpdate(req.user._id, { $set: { cc: { username } } }, { new: true })
        console.log(error);
        console.log("error while fetching codechef data");
        return {
            success: false,
            error: "CodeChef username not found or Server Unresponsive",
        }
        // return next(new ErrorHand("error while fetching codechef data",500));
    }
}

module.exports.refreshData = async () => {
    const allUsers = await User.find({}, 'cf.username lc.username cc.username');
    const updates = [];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    for (const user of allUsers) {
        const updateObj = {};
        let flag = false;
        if (user.cf && user.cf.username) {
            const data = await module.exports.getCodeforcesData(user.cf.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            if (data) {
                flag = true;
                if (data.update) {

                }
                else if (!data.success && data.error) {
                    updateObj.cf = {};
                }
                else {
                    updateObj.cf = data;
                }
            }
        }
        if (user.lc && user.lc.username) {
            const data = await module.exports.getLeetcodeData(user.lc.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            // console.log(data)
            if (data) {
                flag = true;
                if (data.update) {

                }
                else if (!data.success && data.error) {
                    updateObj.lc = {};
                }
                else {
                    updateObj.lc = data
                }
            }
        }
        if (user.cc && user.cc.username) {
            const data = await module.exports.getCodechefData(user.cc.username);
            await delay(1000 / 3);  // Delay to ensure 3 API calls per second
            // console.log(data)
            if (data) {
                flag = true;
                if (!data.success && data.error) {
                    updateObj.cc = {};
                }
                else {
                    updateObj.cc = data
                }
            }
        }
        if (flag) {
            updateObj.aggregateRating = calcAggregateRating(updateObj)
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
        return {
            status: 200,
            success: true,
            message: "Bulk update users successful"
        };
    } catch (err) {
        // console.error('Error:', err);
        return {
            success: false,
            message: "Error Occurred",
            error: err
        };
    }
}



/////////////////// Upcoming Contests /////////////////////////////

const bulkUpContest = [];

const getLCupContests = async () => {
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            headers: {
                'Content-Type': 'application/json',
            },
            query: `{
           topTwoContests{
             title
             startTime
             duration
             cardImg
           }
         }`
        })

        function convertToSlug(text) {
            return text
                .toLowerCase() // Convert to lowercase
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters (except hyphens) with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
        }

        response?.data?.data?.topTwoContests?.forEach((el) => {
            bulkUpContest.push({
                title: el.title,
                startTime: el.startTime * 1000,
                duration: (el.duration / 3600),
                url: `https://leetcode.com/contest/${convertToSlug(el.title)}/`,
                platform: "lc",
            })
        })

        return {
            update: true,
        }
        // console.log(bulkUpContest);
    } catch (error) {
        console.log("error while fetching leetcode upcoming contest details", error);
        return {
            update: false,
        }
    }
}

const getCFupContests = async () => {
    try {
        const response = await axios.get("https://codeforces.com/api/contest.list")
        for (const contest of response?.data?.result) {
            if (contest.phase === "FINISHED") break;
            bulkUpContest.push({
                title: contest.name,
                startTime: contest.startTimeSeconds * 1000,
                duration: (contest.durationSeconds / 3600),
                url: `https://codeforces.com/contests/${contest.id}`,
                platform: "cf",
            })
        }

        return {
            update: true
        }
        // console.log(bulkUpContest);
    } catch (error) {
        console.log("Error while fetching codeforces upcoming contests", error);
        return {
            update: false
        }
    }
}

const getCCupContests = async () => {
    try {
        const response = await axios.get("https://www.codechef.com/api/list/contests/all")
        for (const contest of response?.data?.future_contests) {
            bulkUpContest.push({
                title: contest.contest_name,
                startTime: new Date(contest.contest_start_date_iso).getTime(),
                duration: (contest.contest_duration / 60),
                url: `https://www.codechef.com/${contest.contest_code}`,
                platform: "cc",
            })
        }

        return {
            update: true
        }
        // console.log(bulkUpContest);
    } catch (error) {
        console.log("Error while fetching codechef upcoming contests", error);

        return {
            update: false
        }
    }
}


module.exports.refreshUpContests = async () => {

    const lcupdate = await getLCupContests();
    const cfupdate = await getCFupContests();
    const ccupdate = await getCCupContests();

    if (lcupdate.update) {
        await UpContest.deleteMany({ platform: 'lc' });
    }
    if (cfupdate.update) {
        await UpContest.deleteMany({ platform: 'cf' });
    }
    if (ccupdate.update) {
        await UpContest.deleteMany({ platform: 'cc' });
    }

    try {
        // console.log(bulkUpContest);
        const result = await UpContest.insertMany(bulkUpContest, { ordered: false });
        //ordered false means if any documents fails while inserting it will continue the process not stop due to error in one document
        // console.log('Bulk insert upcoming contests successful:');
        return {
            status: 200,
            success: true,
            message: 'Bulk insert upcoming contests successful',
        }
    } catch (err) {
        // console.error('Bulk insert upcoming contests failed:', error);
        return {
            success: false,
            message: 'Error Occurred',
            error: err,
        }
    }
}


