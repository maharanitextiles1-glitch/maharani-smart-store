import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  query: { type: String, required: true },
  resultCount: { type: Number, default: 0 },
  selectedType: { type: String, enum: ["product","section", null], default: null },
  selectedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  floorViewed: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", default: null }
}, { timestamps: true });

export const SearchAnalytics = mongoose.model("SearchAnalytics", analyticsSchema);
