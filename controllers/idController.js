const Id = require("../models/ID-card");
const HttpError = require("../models/http-error");
const dotenv = require("dotenv");
dotenv.config();
// Create a new ID
exports.createId = async (req, res, next) => {
  try {
    const { name, location, idNumber, date, phone, birthLocation } = req.body;
    const userId = req.user._id;
    const foundDetails = await Id.findOne({ idNumber });

    if (foundDetails) {
      return next(new HttpError("validation error", "Details already exists", 422));
    }
    const newIdDetails = await Id.create({
      name,
      location,
      idNumber,
      date,
      phone,
      birthLocation,
      userId,
    });
    res
      .status(201)
      .json({
        message: "ID Details created successfully",
        newId: newIdDetails,
      });
  } catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to create ID",
      500
    ));
  }
};

// Get all IDs
exports.getAllIds = async (req, res) => {
  try {
    const { userId } = req.query;
    let foundIdDetails;
    if(!userId) {
    foundIdDetails = await Id.findOne({});
    }
    
    foundIdDetails = await Id.findOne({ _id: req.params.id, userId });
    res.status(200).json({ids: foundIdDetails});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one ID
exports.getId = async (req, res) => {
  try {
    const id = await Id.findOne({ _id: req.params.id, userId: req.user._id });
    if (!id) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.status(200).json(id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an ID
exports.updateId = async (req, res) => {
  try {
    const updatedId = await Id.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Ensure the ID belongs to the authenticated user
      req.body,
      { new: true }
    );
    if (!updatedId) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.status(200).json(updatedId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch all IDs posted by a specific user
exports.getIdsByUserId = async (req, res) => {
  try {
    const ids = await Id.find({ userId: req.user._id }); // Use authenticated user's ID
    if (ids.length === 0) {
      return res.status(404).json({ message: "No IDs found for this user" });
    }
    res.json(ids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Delete an ID
exports.deleteId = async (req, res) => {
  try {
    const deletedId = await Id.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    }); // Ensure the ID belongs to the authenticated user
    if (!deletedId) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.status(200).json({ message: "ID deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
