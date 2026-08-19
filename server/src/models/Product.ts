import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  imageUrl: String,
  keywords: [{ type: String }],
  alternativeNames: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: "text", category: "text", subcategory: "text", keywords: "text", alternativeNames: "text" });

export const Product = mongoose.model("Product", productSchema);
