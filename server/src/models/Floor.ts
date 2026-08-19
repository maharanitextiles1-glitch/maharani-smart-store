import mongoose from "mongoose";

const floorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  order: { type: Number, required: true, default: 0 },
  description: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Floor = mongoose.model("Floor", floorSchema);
