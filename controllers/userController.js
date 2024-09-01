const User = require("../models/user");
const Id = require("../models/ID-card");
const HttpError = require("../models/http-error");

// Fetch user profile details
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, '-password'); // Exclude password from the response
    if (!user) {
      return next(new HttpError("User not found", "No user found with this ID", 404));
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return next(new HttpError("server error", "An error has occurred while trying to fetch user profile", 500));
  }
};

// Update user profile details
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone },
      { new: true }
    ).select('-password'); // Exclude password from the response

    if (!updatedUser) {
      return next(new HttpError("User not found", "No user found with this ID", 404));
    }
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return next(new HttpError("server error", "An error has occurred while trying to update user profile", 500));
  }
};

// Fetch the IDs posted by the user
exports.getPostedIds = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const postedIds = await Id.find({ userId }).select('-userId -birthLocation'); // Exclude sensitive fields

    if (postedIds.length === 0) {
      return res.status(404).json({ message: "No IDs found for this user" });
    }

    res.status(200).json({ postedIds, total: postedIds.length });
  } catch (err) {
    console.error(err);
    return next(new HttpError("server error", "An error has occurred while trying to fetch posted IDs", 500));
  }
};

// Change the password
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new HttpError("Invalid input", "Old and new passwords are required", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new HttpError("User not found", "No user found with this ID", 404));
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new HttpError("Invalid credentials", "Old password is incorrect", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return next(new HttpError("server error", "An error has occurred while trying to change password", 500));
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found", "No user found with this ID", 404));
    }

    await Id.deleteMany({ userId }); // Delete all IDs associated with the user
    await user.remove();

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error(err);
    return next(new HttpError("server error", "An error has occurred while trying to delete user account", 500));
  }
};
