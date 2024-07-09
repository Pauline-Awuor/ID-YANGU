const express = require("express");
const idController = require("../controllers/idController");

const router = express.Router();

router.post("/", idController.createId);

router.patch("/:id", idController.updateId);

router.get("/", idController.getAllIds);

router.get("/:id", idController.getId);

// Route to fetch all IDs posted by a specific user
router.get("/user/:userId/ids", idController.getIdsByUserId);

router.delete("/:id", idController.deleteId);

module.exports = router;

