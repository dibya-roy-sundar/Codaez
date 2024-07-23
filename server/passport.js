const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport');
const User = require('./models/user');
const { cloudinary } = require("./cloudinary/index.js");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/v1/auth/google/callback`,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ $or:[{googleId: profile.id},{email:profile.emails[0].value }]});
                let isNew = !user ? true : false

                if (!user) {
                    const response = await cloudinary.uploader.upload(profile.photos[0].value, {
                        folder: 'codaez'
                    })
                    // console.log(response);
                    const avatar = {
                        url: response.url,
                        filename: response.public_id,
                    }
                //   const  firstName=profile.name.givenName;
                //   const lastName=profile.name.familyName;
                //   console.log(firstName,lastName);

                    user = new User({
                        googleId: profile.id,
                        // username: profile.emails[0].value.split('@')[0],
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: avatar,
                    });
                    await user.save();

                }
                else {
                    if (!(user.username)) {
                        isNew = true;
                    }
                }

                // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                const token = user.getJWTToken();

                done(null, { user, token, isNew });
            } catch (err) {
                done(err, false);
            }
        }
    )
)