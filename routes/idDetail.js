const express = require('express');
const router = express.Router();
const idController = require('../controllers/idController');
const accessToken = require('../middleware/accessToken');

// Create a new ID
router.post('/create', accessToken, idController.createId);

// Get all IDs (admin only)
router.get('/all', accessToken, idController.getAllIds);

// Get one ID (owned by the user)
router.get('/:id', accessToken, idController.getId);

// Update an ID (owned by the user)
router.patch('/:id', accessToken, idController.updateId);

// Fetch all IDs posted by a specific user
router.get('/user', accessToken, idController.getIdsByUserId);  // Updated route to use query parameters

// Delete an ID (owned by the user)
router.delete('/:id', accessToken, idController.deleteId);

// Search for an ID
router.get('/search', accessToken, idController.searchId);

// Notify User
router.post('/notify', accessToken, idController.notifyUser);

// Get the total count of IDs (accessible to everyone)
router.get('/count', idController.getTotalCountOfIds);

module.exports = router;
