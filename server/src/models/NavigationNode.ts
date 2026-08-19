import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  nodeId: { type: mongoose.Schema.Types.ObjectId, ref: "NavigationNode", required: true },
  distance: { type: Number, default: 1 }
}, { _id: false });

const nodeSchema = new mongoose.Schema({
  floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
  key: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["entrance","walkway","stairs","elevator","escalator","section"],
    required: true
  },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  label: String,
  connections: [connectionSchema]
}, { timestamps: true });

export const NavigationNode = mongoose.model("NavigationNode", nodeSchema);
