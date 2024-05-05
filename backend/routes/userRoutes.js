const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/details/:userId", verifyToken, userController.getUserDetails);

module.exports = router;
