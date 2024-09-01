const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../models/http-error");

async function accessToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new HttpError("Authorization header is missing", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new HttpError("Token is missing", 401));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return next(new HttpError("Invalid or expired token", 401));
    }

    if (!decodedToken || !decodedToken._id) {
      return next(new HttpError("Invalid token payload", 401));
    }

    const userId = decodedToken._id.trim();
    const foundProfile = await User.findById(userId, { password: 0 }).exec();
    if (!foundProfile) {
      return next(new HttpError("User not found", 404));
    }

    req.user = { ...foundProfile._doc };
    next();
  } catch (err) {
    console.error("Access token validation failed:", err);
    next(new HttpError("Access token validation failed", 401));
  }
}

module.exports = accessToken;
