const express = require("express");
const idController = require("../controllers/idController");
const accessToken = require("../middleware/accessToken");
const IdRequest = require('../models/IdRequest');
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", accessToken, idController.createId);

router.patch("/:id", accessToken, idController.updateId);

router.get("/", idController.getAllIds);

router.get("/single/:id", accessToken, idController.getId);

router.delete("/:id", accessToken, idController.deleteId);

// Search endpoint
router.get("/search", accessToken, idController.searchId);


router.get('/posted-ids', accessToken, userController.getPostedIds);

module.exports = router;
