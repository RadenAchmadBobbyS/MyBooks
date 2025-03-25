const passport = require("passport");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("node-fetch");

class AuthController {
  static googleAuth = passport.authenticate("google", { scope: ["profile", "email", "https://www.googleapis.com/auth/books"] });

  static googleCallback(req, res) {
    const { token, accessToken, refreshToken } = req.user;
    res.json({ jwt: token, googleAccessToken: accessToken, googleRefreshToken: refreshToken });
  }

  static async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh Token is required" });

    try {
      const { data } = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (!data.access_token) return res.status(400).json({ error: "Invalid refresh token" });

      res.json({ accessToken: data.access_token });
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh token", details: error.response?.data || error.message });
    }
  }

  static async login(req, res) {
    try {
      const { googleAccessToken } = req.body;

      if (!googleAccessToken) {
        return res.status(400).json({ error: "Missing Google access token" });
      }

      console.log("Google Access Token:", googleAccessToken);

      // Verifikasi token dengan Google API
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleAccessToken}`
      );
      const userInfo = await response.json();

      console.log("Google User Info:", userInfo);

      if (!userInfo.email) {
        return res.status(401).json({ error: "Invalid Google access token" });
      }

      // Buat JWT untuk aplikasi kita
      const jwtToken = jwt.sign(
        { email: userInfo.email },
        "RAHASIA", // Ganti dengan environment variable
        { expiresIn: "1h" }
      );

      res.json({ jwt: jwtToken, googleAccessToken });
    } catch (error) {
      console.error("ERROR:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = AuthController;
