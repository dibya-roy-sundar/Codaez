const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ErrorHand = require("../utils/errorHand");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

module.exports.getCodeforcesData=async (req,username,next)=>{
    try {
        async function postData(url = "", data = {}) {
            const response = await fetch(url);
            return response.json();
        }

        postData(`https://codeforces.com/api/user.info?handles=${username}`).then(async (data) => {
            if (data.result) {
                const result = {
                    username: data.result[0].handle,
                    rating: data.result[0].rating,
                    rank: data.result[0].rank,
                    maxRating: data.result[0].maxRating,
                    maxRank: data.result[0].maxRank,
                }
                req.user=await User.findByIdAndUpdate(req.user._id,{$set:{cf:result}},{new:true});
                return result;
            }
            else if (data.comment) {
               return next(new ErrorHand(data.comment || "data fetching error in codeforces",500))
            }
            else {
                return  next(new ErrorHand(data || "data fetching error in codeforces",500))
            }
        })
        
    } catch (error) {
        req.user=await User.findByIdAndUpdate(req.user._id,{$set:{cf:{username}}},{new:true})
        console.log(error);
        return next( new ErrorHand("error while fetching codeforces data",500));
    }
}


module.exports.getLeetcodeData=async (req,username,next) =>{
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
      }
    `;

    fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({ query: query, variables: { username: username } }),
    })
        .then(result => result.json())
        .then(async (data) => {
            if (data.errors) {
              return next(new ErrorHand(data.errors?.message,500))
            } else {
                // console.log(data.data);
                const result = {
                    username: username,
                    rating: data.data.userContestRanking.rating,
                    rank: data.data.userContestRanking.globalRanking,
                    topPercentage: data.data.userContestRanking.topPercentage,
                    badge: data.data.userContestRanking.badge,
                    attendedContestsCount: data.data.userContestRanking.attendedContestsCount,
                    totalquestions:data.data.matchedUser.submitStats.acSubmissionNum[0]?.count,
                    easyquestions:data.data.matchedUser.submitStats.acSubmissionNum[1]?.count,
                    mediumquestions:data.data.matchedUser.submitStats.acSubmissionNum[2]?.count,
                    hardquestions:data.data.matchedUser.submitStats.acSubmissionNum[3]?.count,
                }
               req.user=await User.findByIdAndUpdate(req.user._id,{$set:{lc:result}},{new:true});
               return result
            }
        })    
} catch (error) {
    req.user=await User.findByIdAndUpdate(req.user._id,{$set:{lc:{username}}},{new:true})
    console.log(error);
    return next(new ErrorHand("error while fetching leetcode data",500));
}
}


module.exports.getCodechefData=async (req,username,next)=>{
    try {
        let data = await axios.get(`https://www.codechef.com/users/${username}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const result = {
            username: document.querySelector('.user-details-container').children[0].children[1].textContent,
            rating: parseInt(document.querySelector(".rating-number").textContent),
            maxRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
            rank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
            countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            stars: document.querySelector('.rating').textContent || "unrated",
        }
        req.user=await User.findByIdAndUpdate(req.user._id,{$set:{cc:result}},{new:true});
        return result;
        
    } catch (error) {
        req.user=await User.findByIdAndUpdate(req.user._id,{$set:{cc:{username}}},{new:true})
        console.log(error);
        console.log("error while fetching codechef data");
        return next()
        // return next(new ErrorHand("error while fetching codechef data",500));
    }
}