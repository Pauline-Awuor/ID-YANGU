const express = require("express");
const idController = require("../controllers/idController");
const accessToken = require("../middleware/accessToken");
const IdRequest = require('../models/IdRequest');

const router = express.Router();

router.post("/", accessToken, idController.createId);

router.patch("/:id", accessToken, idController.updateId);

router.get("/", idController.getAllIds);

router.get("/:id", accessToken, idController.getId);

router.delete("/:id", accessToken, idController.deleteId);

// Search endpoint
router.get("/search", accessToken, idController.searchId);

module.exports = router;
