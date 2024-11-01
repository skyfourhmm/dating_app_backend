import express from "express";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/allUser", async (req, res) => {
  try {
    const profile = await Profile.find();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.put("/updateMatched/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId }); // Tìm bằng `userId` tùy chỉnh

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error });
  }
});

export default router;
