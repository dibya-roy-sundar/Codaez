const express = require('express');
const { login, register, logout, changePassword, setUsername, userDetails,
    sendFollowRequest, acceptFollowRequest, rejectFollowRequest, updateProfile, profile,
    editAvatar, completeProfile, getReqeusts, withdrawRequest, unFollow,
    changeUsername, getFollowDetails, dashboard,
    sendOtp, 
    landing} = require('../controllers/user.js');
const { isLoggedIn } = require('../utils/isLoggedIn.js');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const passport = require('passport');


const upload = multer({ storage })

const router = express.Router({ mergeParams: true });

router.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }))
router.get('/auth/google/callback',
    passport.authenticate('google', {
        // successRedirect:process.env.CLIENT_URL,
        // failureRedirect:"/login/failed",
        session: false,
    }),
    (req, res, next) => {
        const { user, token, isNew } = req.user;
        // let options = {
        //     expires: new Date(
        //         Date.now() + 7 * 24 * 60 * 60 * 1000
        //     ),
        //     httpOnly: true,
        //     // secure: process.env.NODE_ENV === 'production', // Set to true in production
        //     sameSite: 'None'
        // }
        // if (process.env.NODE_ENV === 'production') {
        //     options = {
        //         ...options,
        //         secure: true, // Set to true in production
        //         sameSite: 'None'
        //     }
        // }

        // res.status(200).cookie("token", token, options);

        if (isNew) {
            res.redirect(`${process.env.CLIENT_URL}/completeprofile?email=${user.email}&name=${user.name}&avatarUrl=${user.avatar.url}&fromgauth=${true}&token=${token}`);
        }
        else {
            res.redirect(`${process.env.CLIENT_URL}/dashboard?email=${user.email}&name=${user.name}&username=${user.username}&fromgauth=${true}&token=${token}`);
        }
    }
)


router.route('/register').post(catchAsync(register));
router.route('/send-otp').post(catchAsync(sendOtp));
router.route('/login').post(catchAsync(login));
router.route('/complete-profile').put(catchAsync(isLoggedIn), upload.single('avatar'), catchAsync(completeProfile));
router.route('/setusername').post(catchAsync(isLoggedIn), catchAsync(setUsername));
router.route('/logout').get(catchAsync(logout));


router.route('/userdetails').get(catchAsync(isLoggedIn),catchAsync(userDetails));//search 

router.route('/get-requests').get(catchAsync(isLoggedIn), catchAsync(getReqeusts));//
router.route('/sendfrequest').post(catchAsync(isLoggedIn), catchAsync(sendFollowRequest));
router.route('/withdraw-request').post(catchAsync(isLoggedIn), catchAsync(withdrawRequest));
router.route('/acceptfrequest').post(catchAsync(isLoggedIn), catchAsync(acceptFollowRequest));
router.route('/rejectfrequest').post(catchAsync(isLoggedIn), catchAsync(rejectFollowRequest));
router.route('/unfollow').post(catchAsync(isLoggedIn), catchAsync(unFollow));


router.route('/profile/:username').get(catchAsync(isLoggedIn), catchAsync(profile));
router.route('/update-profile').put(catchAsync(isLoggedIn), catchAsync(updateProfile))
router.route('/update-avatar').put(catchAsync(isLoggedIn), upload.single('avatar'), catchAsync(editAvatar))
router.route('/changepw').put(catchAsync(isLoggedIn), catchAsync(changePassword));
router.route('/change-username').put(catchAsync(isLoggedIn), catchAsync(changeUsername));
router.route('/get-follow').get(catchAsync(isLoggedIn), catchAsync(getFollowDetails));
router.route('/dashboard').get(catchAsync(isLoggedIn), catchAsync(dashboard));
router.route('/landing').get(catchAsync(landing));

module.exports = router;