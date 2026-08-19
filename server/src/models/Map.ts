import mongoose from "mongoose";

const landmarkSchema = new mongoose.Schema({
  key: String,
  type: {
    type: String,
    enum: ["entrance","stairs","escalator","elevator","billing","restroom","trial_room","customer_service","other"]
  },
  label: String,
  x: Number,
  y: Number
}, { _id: false });

const mapSchema = new mongoose.Schema({
  floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true, unique: true },
  width: { type: Number, default: 1000 },
  height: { type: Number, default: 700 },
  backgroundSvg: String,
  landmarks: [landmarkSchema],
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const MapModel = mongoose.model("Map", mapSchema);
