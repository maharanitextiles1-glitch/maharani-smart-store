import { Product } from "../models/Product.js";
import { Section } from "../models/Section.js";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function smartSearch(q: string) {
  const term = normalize(q);
  if (!term) return { sections: [], products: [] };

  const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const sections = await Section.find({
    active: true,
    $or: [
      { name: regex },
      { category: regex },
      { keywords: regex },
      { alternativeNames: regex }
    ]
  }).populate("floorId").limit(20).lean();

  const products = await Product.find({
    active: true,
    $or: [
      { name: regex },
      { category: regex },
      { subcategory: regex },
      { keywords: regex },
      { alternativeNames: regex }
    ]
  }).populate({
    path: "sectionId",
    populate: { path: "floorId" }
  }).limit(20).lean();

  return { sections, products };
}
