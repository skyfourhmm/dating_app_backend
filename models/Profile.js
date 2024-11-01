import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  imageUrl: {
    mainPhoto: String,
    otherPhotos: [String],
  },
  job: String,
  address: String,
  describe: String,
  tags: [{ id: Number, icon: String, title: String }],
  enjoys: [String],
  communicates: [String],
  listMatched: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
export default mongoose.model("Profile", profileSchema, "profile");
