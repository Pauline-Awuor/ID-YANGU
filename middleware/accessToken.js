const jwt= require("jsonwebtoken");
const User = require("../models/user");
const HttpError= require("../models/http-error");


async function accessToken(
  req,
  res,
  next
) {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token)
      return next(
        new HttpError(
          "Access token error",
          "Invalid or expired access token",
          401
        )
      );
      const decodedToken = jwt.verify(
        token,
      process.env.SECRET_KEY
      );
    const id = decodedToken?._id.trim();

    const foundProfile = (await User.findById(id, {
      password: 0,
    })) ;

    if (!foundProfile) {
      return next(new HttpError("Error", "User not found", 404));
    }

    if (!foundProfile)
      return next(
        new HttpError(
          "Access token error",
          "Invalid or expired access token",
          401
        )
      );
    req.user = { ...foundProfile["_doc"] };
   
    next();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Access token validation failed", null, 401));
  }
}

module.exports = accessToken