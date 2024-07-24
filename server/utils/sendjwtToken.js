const sendjwtToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    let options = {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'Lax'
    }
    if (process.env.NODE_ENV === 'production') {
        options = {
            ...options,
            secure: true, // Set to true in production
            sameSite: 'Strict'
        }
    }
    res.cookie("token", token, options);
    res.status(statusCode).json({
        success: true,
        user,
        token,
        cookieOptions: options,
    });
};

module.exports = sendjwtToken;