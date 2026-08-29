const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controller/authController");
const { protect } = require("../middlewere/authMidleware");
const { admin } = require("../middlewere/adminMidleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);

module.exports = router;
