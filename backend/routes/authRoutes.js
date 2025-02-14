import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
