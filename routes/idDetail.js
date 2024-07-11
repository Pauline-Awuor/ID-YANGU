const express = require("express");
const idController = require("../controllers/idController");
const accessToken = require("../middleware/accessToken");
const IdRequest = require('../models/IdRequest');

const router = express.Router();

router.post("/", accessToken, idController.createId);

router.patch("/:id", accessToken, idController.updateId);

router.get("/", accessToken, idController.getAllIds);

router.get("/:id", accessToken, idController.getId);

router.delete("/:id", accessToken, idController.deleteId);

// Search endpoint
router.get("/search", accessToken, async (req, res, next) => {
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
    next(err);
  }
});

module.exports = router;
