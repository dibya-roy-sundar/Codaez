const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

module.exports.getDetails = async (req, res, next) => {
    const { platform } = req.params;


    if (platform == 'codeforces') {
        try {
            const username = req.user.cf;
            async function postData(url = "", data = {}) {
                const response = await fetch(url);
                return response.json();
            }
            postData(`https://codeforces.com/api/user.info?handles=${username}`).then((data) => {
                if (data.result) {
                    const result = {
                        handle: data.result[0].handle,
                        rating: data.result[0].rating,
                        rank: data.result[0].rank,
                        maxRating: data.result[0].maxRating,
                        maxRank: data.result[0].maxRank,
                    }
                    res.status(200).json({
                        success: true,
                        platform: platform,
                        result
                    });
                }
                else if (data.comment) {
                    res.status(200).json({
                        success: false,
                        platform: platform,
                        msg: data.comment
                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        platform: platform,
                        data
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                error: err,
            })
        }

    }
    else if (platform == 'leetcode') {
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
              }
            `;
            const username = req.user.lc;
            fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com'
                },
                body: JSON.stringify({ query: query, variables: { username: username } }),
            })
                .then(result => result.json())
                .then(data => {
                    if (data.errors) {
                        res.status(500).json({
                            status: false,
                            data
                        });
                    } else {
                        const result = {
                            handle: username,
                            rating: data.data.userContestRanking.rating,
                            rank: data.data.userContestRanking.globalRanking,
                            topPercentage: data.data.userContestRanking.topPercentage,
                            badge: data.data.userContestRanking.badge,
                            attendedContestsCount: data.data.userContestRanking.attendedContestsCount
                        }
                        res.status(200).json({
                            status: true,
                            result
                        });
                    }
                })
                .catch(err => {
                    console.error('Error', err);
                    res.status(500).json({
                        status: false,
                        err
                    });
                });
        }
        catch (err) {
            console.log(err);
        }
    }
    else if (platform == 'codechef') {
        const username = req.user.cc;
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
            res.status(200).send({
                success: true,
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err
            });
        }
    }
    // else if (platform == 'hacckerrank') { }
    // else if (platform == 'gfg') {
    // mittaly0rzu
    // dibyasundarroy
    // }
    else {
        res.status(500).json({
            status: false,
        })
    }
    // res.status(200).json({
    //     status: true,
    //     plat: platform,
    // });
}