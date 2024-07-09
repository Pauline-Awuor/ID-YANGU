const Id = require('../models/ID-card');

// Controller functions

// Create a new ID
exports.createId = async (req, res) => {
  try {
    const newId = await Id.create(req.body);
    res.status(201).json(newId);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all IDs
exports.getAllIds = async (req, res) => {
  try {
    const ids = await Id.find();
    res.status(200).json(ids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one ID
exports.getId = async (req, res) => {
  try {
    const id = await Id.findById(req.params.id);
    if (!id) {
      return res.status(404).json({ message: 'ID not found' });
    }
    res.status(200).json(id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an ID
exports.updateId = async (req, res) => {
  try {
    const updatedId = await Id.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedId) {
      return res.status(404).json({ message: 'ID not found' });
    }
    res.status(200).json(updatedId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch all IDs posted by a specific user
exports.getIdsByUserId = async (req, res) => {
  try {
    const ids = await Id.find({ userId: req.params.userId });
    if (ids.length === 0) {
      return res.status(404).json({ message: 'No IDs found for this user' });
    }
    res.json(ids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Delete an ID
exports.deleteId = async (req, res) => {
  try {
    const deletedId = await Id.findByIdAndDelete(req.params.id);
    if (!deletedId) {
      return res.status(404).json({ message: 'ID not found' });
    }
    res.status(200).json({ message: 'ID deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
