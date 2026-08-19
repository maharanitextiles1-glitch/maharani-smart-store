import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
