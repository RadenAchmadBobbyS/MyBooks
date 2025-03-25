const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/protected-route", authMiddleware, (req, res) => {
    res.json({ message: "Success! You accessed a protected route.", user: req.user });
});

module.exports = router;