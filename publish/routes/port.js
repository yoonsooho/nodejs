const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send(`${req.app.get("port")}, ${req.get("Connection")}`);
});

module.exports = router;
