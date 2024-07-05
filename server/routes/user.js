const express = require('express');
const { login, register, logout, changePassword, setUsername, userDetails, sendFollowRequest, acceptFollowRequest, rejectFollowRequest, updateProfile, profile, editAvatar } = require('../controllers/user.js');
const { isLoggedIn } = require('../utils/isLoggedIn.js');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')


const upload = multer({ storage })

const router = express.Router({ mergeParams: true });

router.route('/login').post(catchAsync(login));
router.route('/register').post(upload.single('avatar'), catchAsync(register));
router.route('/logout').get(catchAsync(logout));
router.route('/changepw')
    // .get(changePassword)//changepasswordform
    .post(catchAsync(isLoggedIn), catchAsync(changePassword));
router.route('/setusername').post(catchAsync(isLoggedIn), catchAsync(setUsername));
router.route('/userdetails').get(catchAsync(isLoggedIn), catchAsync(userDetails));
router.route('/sendfrequest').post(catchAsync(isLoggedIn), catchAsync(sendFollowRequest));
router.route('/acceptfrequest').post(catchAsync(isLoggedIn), catchAsync(acceptFollowRequest));
router.route('/rejectfrequest').post(catchAsync(isLoggedIn), catchAsync(rejectFollowRequest));
router.route('/update-profile').post(catchAsync(isLoggedIn), catchAsync(updateProfile))
router.route('/update-avatar').post(catchAsync(isLoggedIn), upload.single('avatar'), catchAsync(editAvatar))
router.route('/profile/:username').get(catchAsync(profile));

module.exports = router;