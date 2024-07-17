const express = require('express');
const { login, register, logout, changePassword, setUsername, userDetails,
    sendFollowRequest, acceptFollowRequest, rejectFollowRequest, updateProfile, profile,
    editAvatar, completeProfile, getReqeusts, withdrawRequest, unFollow, 
    changeUsername,
    getFollowDetails,
    sendOtp} = require('../controllers/user.js');
const { isLoggedIn } = require('../utils/isLoggedIn.js');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')


const upload = multer({ storage })

const router = express.Router({ mergeParams: true });

router.route('/register').post(catchAsync(register));
router.route('/send-otp').post(catchAsync(sendOtp));
router.route('/login').post(catchAsync(login));
router.route('/complete-profile').put(catchAsync(isLoggedIn),upload.single('avatar'), catchAsync(completeProfile));
router.route('/setusername').post(catchAsync(isLoggedIn), catchAsync(setUsername));
router.route('/logout').get(catchAsync(logout));


router.route('/userdetails').get( catchAsync(userDetails));//search catchAsync(isLoggedIn),

router.route('/get-requests').get(catchAsync(isLoggedIn),catchAsync(getReqeusts));//
router.route('/sendfrequest').post(catchAsync(isLoggedIn), catchAsync(sendFollowRequest));
router.route('/withdraw-request').post(catchAsync(isLoggedIn),catchAsync(withdrawRequest));
router.route('/acceptfrequest').post(catchAsync(isLoggedIn), catchAsync(acceptFollowRequest));
router.route('/rejectfrequest').post(catchAsync(isLoggedIn), catchAsync(rejectFollowRequest));
router.route('/unfollow').post(catchAsync(isLoggedIn),catchAsync(unFollow));


router.route('/profile/:username').get(catchAsync(isLoggedIn),catchAsync(profile));
router.route('/update-profile').put(catchAsync(isLoggedIn), catchAsync(updateProfile))
router.route('/update-avatar').put(catchAsync(isLoggedIn), upload.single('avatar'), catchAsync(editAvatar))
router.route('/changepw').put(catchAsync(isLoggedIn), catchAsync(changePassword));
router.route('/change-username').put(catchAsync(isLoggedIn),catchAsync(changeUsername));
router.route('/get-follow').get(catchAsync(isLoggedIn),catchAsync(getFollowDetails));

module.exports = router;