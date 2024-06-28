const express = require('express');
const { getDetails } = require('../controllers/details');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/isLoggedIn');
const router = express.Router({ mergeParams: true });

router.route('/:platform').get(catchAsync(isLoggedIn), catchAsync(getDetails));

module.exports = router;