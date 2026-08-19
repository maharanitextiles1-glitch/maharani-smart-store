import { Router } from "express";
import { Floor } from "../models/Floor.js";
import { Section } from "../models/Section.js";
import { Product } from "../models/Product.js";
import { MapModel } from "../models/Map.js";
import { SearchAnalytics } from "../models/SearchAnalytics.js";
import { smartSearch } from "../services/search.js";
import { getRouteToSection } from "../services/navigation.js";

export const publicRouter = Router();

publicRouter.get("/floors", async (_req, res) => {
  res.json(await Floor.find({ active: true }).sort({ order: 1 }).lean());
});

publicRouter.get("/floors/:id", async (req, res) => {
  const item = await Floor.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Floor not found" });
  res.json(item);
});

publicRouter.get("/sections", async (req, res) => {
  const filter: any = { active: true };
  if (req.query.floorId) filter.floorId = req.query.floorId;
  res.json(await Section.find(filter).populate("floorId").sort({ name: 1 }).lean());
});

publicRouter.get("/sections/:id", async (req, res) => {
  const item = await Section.findById(req.params.id).populate("floorId").lean();
  if (!item) return res.status(404).json({ message: "Section not found" });
  res.json(item);
});

publicRouter.get("/products", async (_req, res) => {
  res.json(await Product.find({ active: true }).populate({
    path: "sectionId",
    populate: { path: "floorId" }
  }).sort({ name: 1 }).lean());
});

publicRouter.get("/products/:id", async (req, res) => {
  const item = await Product.findById(req.params.id).populate({
    path: "sectionId",
    populate: { path: "floorId" }
  }).lean();
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(item);
});

publicRouter.get("/search", async (req, res) => {
  const q = String(req.query.q || "");
  const result = await smartSearch(q);
  await SearchAnalytics.create({
    query: q,
    resultCount: result.sections.length + result.products.length
  });
  res.json({ query: q, ...result });
});

publicRouter.get("/maps/:floorId", async (req, res) => {
  const [map, sections] = await Promise.all([
    MapModel.findOne({ floorId: req.params.floorId, active: true }).lean(),
    Section.find({ floorId: req.params.floorId, active: true }).lean()
  ]);
  if (!map) return res.status(404).json({ message: "Map not found" });
  res.json({ ...map, sections });
});

publicRouter.get("/navigation/:sectionId", async (req, res) => {
  res.json(await getRouteToSection(req.params.sectionId));
});

publicRouter.post("/analytics/search", async (req, res) => {
  const doc = await SearchAnalytics.create(req.body);
  res.status(201).json(doc);
});

publicRouter.post("/analytics/selection", async (req, res) => {
  const doc = await SearchAnalytics.create(req.body);
  res.status(201).json(doc);
});
