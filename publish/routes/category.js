const express = require("express");

const router = express.Router();

router.get("/:name", (req, res) => {
    console.log(req.query);
    res.send(`hello ${req.params.name} ${req.query.id}`);
});

module.exports = router;
