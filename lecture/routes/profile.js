const express = require("express");
const { renderProfile } = require("../controllers/page");
const router = express.Router();

router.get("/", renderProfile);

module.exports = router;
