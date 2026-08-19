import mongoose from "mongoose";

const qrSchema = new mongoose.Schema({
  name: { type: String, required: true },
  locationType: { type: String, enum: ["entrance","checkpoint"], default: "entrance" },
  url: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const QRCodeModel = mongoose.model("QRCode", qrSchema);
