//create and send token and save it in cookie.
const sendToken = (user, statusCode, res) => {
  //create jwt token.
  const token = user.getJwtToken();
  //option for cookie.
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //XSS protection
    sameSite: "lax", // 🔐 CSRF protection
    // secure: process.env.NODE_ENV === "production",
    //🔐Required in production (HTTPS), cookie will be stored only if your domain has certificate.
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
