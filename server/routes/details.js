const express = require('express');
const { getUserDetails, getLeaderboardDetails } = require('../controllers/details');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/isLoggedIn');
const router = express.Router({ mergeParams: true });

router.route('/leaderboard').get(catchAsync(isLoggedIn),catchAsync(getLeaderboardDetails))
router.route('/:platform').get(catchAsync(isLoggedIn), catchAsync(getUserDetails));


router.route('/refreshdata').get((req,res,next)=>{
    console.log('hii');
});

module.exports = router;