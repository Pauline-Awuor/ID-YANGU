const express = require("express");
const idController = require("../controllers/idController");
const  accessToken  = require("../middleware/accessToken");

const router = express.Router();

router.post("/", 
accessToken,idController.createId
);


router.patch("/:id",accessToken, idController.updateId);

router.get("/", accessToken, idController.getAllIds);

router.get("/:id",accessToken, idController.getId);


router.delete("/:id",accessToken, idController.deleteId);

module.exports = router;


