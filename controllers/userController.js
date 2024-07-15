// controllers/userController.js
const idCard = require("../models/ID-card");
const User = require("../models/user");

exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {name, email}, { new: true, select: '-password' });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.getPostedIds = async (req, res) => {
  const userId = req.user._id;

  try {
    
    const postedId = await idCard.find(userId);
   res.status(200).json({ message: "Posted Ids", postedId });

   
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
};
