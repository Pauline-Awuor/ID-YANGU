const Id = require("../models/ID-card");
const HttpError = require("../models/http-error");
const dotenv = require("dotenv");
dotenv.config();
const sendIdNotFoundNotification = require("../utils/mailer") 
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
   
   
     const foundIdDetails = await Id.find({});
    res.status(200).json({ids: foundIdDetails});
  } catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to get all IDs",
      500
    ));
  }
};

// Get one ID
exports.getId = async (req, res, next) => {
  try {
    const id = await Id.findOne({ _id: req.params.id, userId: req.user._id });
    if (!id) {
      return res.status(404).json({ message: "ID not found" });
    }
    res.status(200).json(id);
  }catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to get an ID",
      500
    ));
}};

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
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to update ID",
      500
    ));
}};

// Fetch all IDs posted by a specific user
exports.getIdsByUserId = async (req, res) => {
  try {
    const ids = await Id.find({ userId: req.user._id }); // Use authenticated user's ID
    if (ids.length === 0) {
      return res.status(404).json({ message: "No IDs found for this user" });
    }
    res.json(ids);
  } catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to fetch all IDs",
      500
    ));
}};

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
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to delete ID",
      500
    ));
}};

//Search for an ID
exports.searchId = async (req, res, next) => {
  try {
    const { idNumber } = req.query;
    const foundId = await idController.findId(idNumber);

    if (foundId) {
      return res.status(200).json(foundId);
    } else {
      const existingRequest = await IdRequest.findOne({ email: req.user.email, idNumber });
      if (!existingRequest) {
        await IdRequest.create({ email: req.user.email, idNumber });
      }
      return res.status(404).json({ message: 'ID not found. You will be notified when it is found.' });
    }
  } catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to search for ID details",
      500
    ));
}};

//notify
exports.notifyUser = async (req, res, next) => {
  try {
    const { notify } = req.query;

      const existingRequest = await IdRequest.findOne({ email: req.user.email });
      if (!existingRequest) {
        return res.status(404).json({ message: 'The details entered does not match a request.' });
      }
      existingRequest.notified=notify ==='true' ? true : false;
      await existingRequest.save();
      sendIdNotFoundNotification(req.user.email,existingRequest.idNumber)

      return res.status(200).json({ message: 'You will be notified when it is found.' });
    
  } catch (err) {
    console.error(err);
    return next(new HttpError(
      "server error",
      "An error has occurred while trying to create a notification request",
      500
    ));
  }}

