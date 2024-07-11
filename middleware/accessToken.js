const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../models/http-error");

async function accessToken(req, res, next) {
  try {
// Log headers

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(
        new HttpError(
          "Access token error",
          "Authorization header is missing",
          401
        )
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new HttpError("Access token error", "Token is missing", 401));
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken || !decodedToken._id) {
      return next(
        new HttpError(
          "Access token error",
          "Invalid or expired access token",
          401
        )
      );
    }

    const userId = decodedToken._id.trim();
    const foundProfile = await User.findById(userId, { password: 0 });
    if (!foundProfile) {
      return next(new HttpError("Error", "User not found", 404));
    }

    req.user = { ...foundProfile._doc };
    next();
  } catch (err) {
    console.error("Access token validation failed:", err);
    return next(new HttpError("Access token validation failed", null, 401));
  }
}

module.exports = accessToken;
