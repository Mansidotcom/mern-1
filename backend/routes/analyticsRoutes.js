const express = require("express");
const { protect } = require("../middlewere/authMidleware");
const { admin } = require("../middlewere/adminMidleware");
const { getAdminStats } = require("../controller/analyticsController");

const router = express.Router();

router.get("/", protect, admin, getAdminStats);

module.exports = router;