const express = require('express');
const { getUserDetails, getLeaderboardDetails } = require('../controllers/details');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/isLoggedIn');
const { refreshData } = require('../RefreshData');
const router = express.Router({ mergeParams: true });

router.route('/leaderboard').get(catchAsync(isLoggedIn), catchAsync(getLeaderboardDetails))
router.route('/refreshdata').get((req, res, next) => {
    const data = refreshData();
    return res.status(data.status || 400).json({
        ...data
    });
});
router.route('/:platform').get(catchAsync(isLoggedIn), catchAsync(getUserDetails));



module.exports = router;