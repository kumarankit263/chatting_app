const express = require("express");
const router = express.Router();  // Correct initialization of Router

router.get("/", function(req, res) {
    res.render("index");  // This will render the 'index' view
});

router.get("/chat", function(req, res) {
    res.render("chat");  // This will render the 'index' view
});

module.exports = router;
