const express = require('express');
const { getUserDetails, getLeaderboardDetails } = require('../controllers/details');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/isLoggedIn');
const { refreshData } = require('../RefreshData');
const router = express.Router({ mergeParams: true });

router.route('/leaderboard').get(catchAsync(isLoggedIn), catchAsync(getLeaderboardDetails))
router.route('/refreshdata').get((req, res, next) => {
    const res = refreshData();
    return res.status(res.status || 400).json({
        ...res
    });
});
router.route('/:platform').get(catchAsync(isLoggedIn), catchAsync(getUserDetails));



module.exports = router;