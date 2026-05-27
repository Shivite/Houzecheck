const express = require("express");
const router = express.Router();
const controller = require("../controllers/rate.controller");

router.post("/rate", controller.rateUser);

module.exports = router;