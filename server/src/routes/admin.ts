import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import { Admin } from "../models/Admin.js";
import { Floor } from "../models/Floor.js";
import { Section } from "../models/Section.js";
import { Product } from "../models/Product.js";
import { MapModel } from "../models/Map.js";
import { NavigationNode } from "../models/NavigationNode.js";
import { SearchAnalytics } from "../models/SearchAnalytics.js";
import { QRCodeModel } from "../models/QRCode.js";
import { requireAdmin, type AuthRequest } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email).toLowerCase(), active: true });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  const token = jwt.sign({ id: String(admin._id), role: admin.role }, secret, { expiresIn: "12h" });
  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
});

adminRouter.get("/auth/me", requireAdmin, async (req: AuthRequest, res) => {
  const admin = await Admin.findById(req.admin?.id).select("-passwordHash").lean();
  res.json(admin);
});

adminRouter.use(requireAdmin);

function crud(router: Router, path: string, Model: any) {
  router.get(path, async (_req, res) => res.json(await Model.find({}).sort({ createdAt: -1 }).lean()));
  router.post(path, async (req, res) => res.status(201).json(await Model.create(req.body)));
  router.put(`${path}/:id`, async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  });
  router.delete(`${path}/:id`, async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  });
}

crud(adminRouter, "/floors", Floor);
crud(adminRouter, "/sections", Section);
crud(adminRouter, "/products", Product);
crud(adminRouter, "/maps", MapModel);
crud(adminRouter, "/navigation/nodes", NavigationNode);
crud(adminRouter, "/qr", QRCodeModel);

adminRouter.get("/dashboard", async (_req, res) => {
  const [floors, sections, products, searches] = await Promise.all([
    Floor.countDocuments({ active: true }),
    Section.countDocuments({ active: true }),
    Product.countDocuments({ active: true }),
    SearchAnalytics.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
  ]);
  res.json({ floors, sections, products, searchesToday: searches });
});

adminRouter.get("/analytics/overview", async (_req, res) => {
  const topSearches = await SearchAnalytics.aggregate([
    { $group: { _id: { $toLower: "$query" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  const noResults = await SearchAnalytics.aggregate([
    { $match: { resultCount: 0 } },
    { $group: { _id: { $toLower: "$query" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json({ topSearches, noResults });
});

adminRouter.post("/qr/generate", async (req, res) => {
  const appUrl = process.env.PUBLIC_APP_URL || "http://localhost:5173";
  const name = req.body.name || "Main Entrance";
  const url = req.body.url || `${appUrl}/find?start=main-entrance`;
  const dataUrl = await QRCode.toDataURL(url, { width: 1024, margin: 2 });
  const qr = await QRCodeModel.create({ name, locationType: "entrance", url, active: true });
  res.status(201).json({ qr, dataUrl });
});
