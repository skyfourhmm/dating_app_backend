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

// Đăng ký
router.post("/register", async (req, res) => {
  const {
    isPhoneNumberSignUp,
    isName,
    selectedAge,
    isGender,
    isJob,
    isDescription,
    isLanguage,
    chipsData,
    signUpPass,
  } = req.body;

  // Dữ liệu mặc định
  const imageUrl = { mainPhoto: "", otherPhotos: [] };
  const address = "";
  const tags = [];
  const listMatched = [];
  const listMessenger = [];

  // Kiểm tra dữ liệu đầu vào
  if (!isPhoneNumberSignUp || !signUpPass) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({
      "loginInfo.username": isPhoneNumberSignUp,
    });
    if (existingUser) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }

    // Mã hóa mật khẩu
    const passwordHash = await bcrypt.hash(signUpPass, 10);

    // Tạo người dùng mới
    const newUser = new User({
      profileId: newProfile._id,
      loginInfo: {
        username: phoneNumber,
        passwordHash,
        lastLogin: new Date(),
        isActive: true,
        failedLoginAttempts: 0,
      },
    });
    await newUser.save();

    // Tạo profile cho người dùng (nếu cần)
    const newProfile = new Profile({
      userId: newUser._id,
      isName,
      selectedAge,
      isGender,
      imageUrl,
      isJob,
      address,
      isDescription,
      tags,
      chipsData,
      isLanguage,
      listMatched,
      listMessenger,
    });
    await newProfile.save();

    // Tạo JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Người dùng đã được tạo thành công",
      token,
      user: newUser,
      profile: newProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
});

export default router;
