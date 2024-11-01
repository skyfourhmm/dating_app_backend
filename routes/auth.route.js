import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Đăng nhập
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ "loginInfo.username": phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(
      password,
      user.loginInfo.passwordHash
    );

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    // Tạo JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      { expiresIn: "1h" }
    );

    // Lấy profile của user
    const profile = await Profile.findOne({ userId: user._id });

    return res.status(200).json({ token, user, profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
