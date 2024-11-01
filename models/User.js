import mongoose from "mongoose";

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  loginInfo: {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    lastLogin: { type: Date, required: true },
    failedLoginAttempts: { type: Number, default: 0 },
  },
});

export default mongoose.model("User", userSchema);
