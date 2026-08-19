import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";
import { Floor } from "../models/Floor.js";
import { Section } from "../models/Section.js";
import { Product } from "../models/Product.js";
import { MapModel } from "../models/Map.js";
import { NavigationNode } from "../models/NavigationNode.js";
import { QRCodeModel } from "../models/QRCode.js";
import { SearchAnalytics } from "../models/SearchAnalytics.js";

await connectDB();

await Promise.all([
  Admin.deleteMany({}),
  Floor.deleteMany({}),
  Section.deleteMany({}),
  Product.deleteMany({}),
  MapModel.deleteMany({}),
  NavigationNode.deleteMany({}),
  QRCodeModel.deleteMany({}),
  SearchAnalytics.deleteMany({})
]);

const passwordHash = await bcrypt.hash("Maharani@123", 12);
await Admin.create({
  name: "Maharani Admin",
  email: "admin@maharani.local",
  passwordHash,
  role: "super_admin"
});

const [ground, first, second] = await Floor.create([
  { name: "Ground Floor", code: "GF", order: 0 },
  { name: "1st Floor", code: "F1", order: 1 },
  { name: "2nd Floor", code: "F2", order: 2 }
]);

const sections = await Section.create([
  { name:"Reception", code:"GF-R", floorId:ground._id, category:"Service", mapPosition:{x:80,y:80,width:180,height:120}, navigationInstructions:["Enter through the main entrance.","Reception is directly ahead."], keywords:["help","welcome"], alternativeNames:[] },
  { name:"Billing", code:"GF-B", floorId:ground._id, category:"Service", mapPosition:{x:700,y:80,width:200,height:120}, navigationInstructions:["Walk straight from the entrance.","Billing is on the right."], keywords:["cash","counter","payment"], alternativeNames:["cash counter"] },
  { name:"Customer Service", code:"GF-CS", floorId:ground._id, category:"Service", mapPosition:{x:700,y:250,width:200,height:120}, navigationInstructions:["Walk to the right side of the ground floor."], keywords:["help desk","support"], alternativeNames:[] },
  { name:"Churidar", code:"GF-C", floorId:ground._id, category:"Ladies", mapPosition:{x:80,y:260,width:260,height:180}, navigationInstructions:["From the entrance, turn left.","Churidar section is ahead."], keywords:["kurti","salwar","ladies"], alternativeNames:["salwar suits"] },
  { name:"Accessories", code:"GF-A", floorId:ground._id, category:"Accessories", mapPosition:{x:400,y:260,width:220,height:180}, navigationInstructions:["Walk straight to the centre of the ground floor."], keywords:["bags","belts","fashion accessories"], alternativeNames:[] },

  { name:"House of Saree", code:"HS-B", floorId:first._id, category:"Sarees", mapPosition:{x:80,y:100,width:330,height:220}, navigationInstructions:["Take the stairs to the 1st Floor.","Turn left.","House of Saree is on your right."], keywords:["saree","kasavu","kerala saree","silk"], alternativeNames:["HOS","house of sarees"] },
  { name:"Bridal Sarees", code:"F1-BS", floorId:first._id, category:"Bridal", mapPosition:{x:520,y:100,width:360,height:220}, navigationInstructions:["Take the stairs to the 1st Floor.","Turn right.","Bridal Sarees is ahead."], keywords:["bridal","wedding saree","kanchipuram"], alternativeNames:["wedding sarees"] },
  { name:"Designer Sarees", code:"F1-DS", floorId:first._id, category:"Sarees", mapPosition:{x:80,y:390,width:330,height:200}, navigationInstructions:["Take the stairs to the 1st Floor.","Walk to the rear-left section."], keywords:["designer","party saree"], alternativeNames:[] },
  { name:"Wedding Collection", code:"F1-WC", floorId:first._id, category:"Wedding", mapPosition:{x:520,y:390,width:360,height:200}, navigationInstructions:["Take the stairs to the 1st Floor.","Walk to the rear-right section."], keywords:["wedding","marriage"], alternativeNames:[] },

  { name:"Lehenga", code:"F2-L", floorId:second._id, category:"Lehenga", mapPosition:{x:80,y:100,width:330,height:220}, navigationInstructions:["Go to the 2nd Floor.","Turn left.","Lehenga is on the left wing."], keywords:["lehenga","bridal lehenga"], alternativeNames:["lengha"] },
  { name:"Bridal Gowns", code:"F2-BG", floorId:second._id, category:"Gowns", mapPosition:{x:520,y:100,width:360,height:220}, navigationInstructions:["Go to the 2nd Floor.","Turn right.","Bridal Gowns is ahead."], keywords:["gown","reception gown","bridal gown"], alternativeNames:["wedding gown"] },
  { name:"Reception Collection", code:"F2-RC", floorId:second._id, category:"Reception", mapPosition:{x:80,y:390,width:330,height:200}, navigationInstructions:["Go to the 2nd Floor.","Walk to the rear-left section."], keywords:["reception","party"], alternativeNames:[] },
  { name:"Jewellery", code:"F2-J", floorId:second._id, category:"Jewellery", mapPosition:{x:520,y:390,width:360,height:200}, navigationInstructions:["Go to the 2nd Floor.","Walk to the rear-right section."], keywords:["jewellery","necklace","bridal jewellery"], alternativeNames:["jewelry"] }
]);

const byName = Object.fromEntries(sections.map(s => [s.name, s]));

await Product.create([
  { name:"Kasavu Silk Saree", category:"Saree", subcategory:"Kerala Saree", sectionId:byName["House of Saree"]._id, keywords:["kasavu","kerala saree","traditional saree"], alternativeNames:["kasavu saree"] },
  { name:"Bridal Kanchipuram Saree", category:"Saree", subcategory:"Bridal", sectionId:byName["Bridal Sarees"]._id, keywords:["bridal","kanchipuram","wedding"], alternativeNames:["bridal silk saree"] },
  { name:"Designer Silk Saree", category:"Saree", subcategory:"Designer", sectionId:byName["Designer Sarees"]._id, keywords:["designer","silk","party"], alternativeNames:[] },
  { name:"Bridal Lehenga", category:"Lehenga", subcategory:"Bridal", sectionId:byName["Lehenga"]._id, keywords:["bridal lehenga","wedding lehenga"], alternativeNames:["lengha"] },
  { name:"Reception Gown", category:"Gown", subcategory:"Reception", sectionId:byName["Bridal Gowns"]._id, keywords:["reception gown","party gown"], alternativeNames:["wedding gown"] }
]);

await MapModel.create([
  { floorId:ground._id, width:1000, height:700, landmarks:[{key:"main-entrance",type:"entrance",label:"Main Entrance",x:500,y:650},{key:"stairs-g",type:"stairs",label:"Stairs",x:500,y:150}] },
  { floorId:first._id, width:1000, height:700, landmarks:[{key:"stairs-1",type:"stairs",label:"Stairs",x:500,y:650}] },
  { floorId:second._id, width:1000, height:700, landmarks:[{key:"stairs-2",type:"stairs",label:"Stairs",x:500,y:650}] }
]);

// Navigation graph
const nodeDefs = [
  {key:"entrance", floorId:ground._id, type:"entrance", x:500,y:650,label:"Main Entrance"},
  {key:"ground-mid", floorId:ground._id, type:"walkway", x:500,y:450,label:"Ground Floor Centre"},
  {key:"stairs-g", floorId:ground._id, type:"stairs", x:500,y:150,label:"Ground Floor Stairs"},
  {key:"stairs-1", floorId:first._id, type:"stairs", x:500,y:650,label:"1st Floor Stairs"},
  {key:"first-mid", floorId:first._id, type:"walkway", x:500,y:350,label:"1st Floor Centre"},
  {key:"stairs-2", floorId:second._id, type:"stairs", x:500,y:650,label:"2nd Floor Stairs"},
  {key:"second-mid", floorId:second._id, type:"walkway", x:500,y:350,label:"2nd Floor Centre"}
] as any[];

for (const s of sections) {
  const p = s.mapPosition!;
  nodeDefs.push({
    key:`section-${s.code}`,
    floorId:s.floorId,
    type:"section",
    sectionId:s._id,
    x:p.x + p.width/2,
    y:p.y + p.height/2,
    label:s.name
  });
}

const created:any = {};
for (const d of nodeDefs) {
  created[d.key] = await NavigationNode.create({ ...d, connections: [] });
}

async function link(a:string,b:string,distance:number) {
  await NavigationNode.findByIdAndUpdate(created[a]._id, {$push:{connections:{nodeId:created[b]._id,distance}}});
  await NavigationNode.findByIdAndUpdate(created[b]._id, {$push:{connections:{nodeId:created[a]._id,distance}}});
}
await link("entrance","ground-mid",200);
await link("ground-mid","stairs-g",300);
await link("stairs-g","stairs-1",80);
await link("stairs-1","first-mid",300);
await link("stairs-1","stairs-2",80);
await link("stairs-2","second-mid",300);

for (const s of sections) {
  const key = `section-${s.code}`;
  const floor = String(s.floorId);
  if (floor === String(ground._id)) await link("ground-mid", key, 220);
  if (floor === String(first._id)) await link("first-mid", key, 220);
  if (floor === String(second._id)) await link("second-mid", key, 220);
}

await QRCodeModel.create({
  name:"Main Entrance",
  locationType:"entrance",
  url:`${process.env.PUBLIC_APP_URL || "http://localhost:5173"}/find?start=main-entrance`
});

console.log("Seed complete");
await mongoose.disconnect();
