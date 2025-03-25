const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false }), AuthController.googleCallback);
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;