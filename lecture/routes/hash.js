const express = require("express");
const { renderHashtag } = require("../controllers/page");
const router = express.Router();

router.get("/:hashtag", renderHashtag);

module.exports = router;
