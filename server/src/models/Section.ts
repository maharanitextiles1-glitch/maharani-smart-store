import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
  category: { type: String, required: true },
  description: String,
  mapPosition: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  navigationInstructions: [{ type: String }],
  keywords: [{ type: String }],
  alternativeNames: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

sectionSchema.index({ name: "text", category: "text", keywords: "text", alternativeNames: "text" });

export const Section = mongoose.model("Section", sectionSchema);
