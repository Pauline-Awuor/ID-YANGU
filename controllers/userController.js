const idCard = require("../models/ID-card");
const User = require("../models/user");

// Update user profile
exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, email, phone } = req.body;

  // Ensure all required fields are provided
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, select: '-password' }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getPostedIds = async (req, res) => {
  try {
  const userId = req.user._id;

    // Fetch the IDs associated with the user
    const userIds = await IdCard.find({ userId });

    // Respond with the found IDs
    res.status(200).json({ message: "Posted IDs", postedIds: userIds ,total: userIds.length});


    res.status(200).json({ message: "Posted IDs", postedIds ,total: itemCount});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
