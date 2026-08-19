import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean) as string[],
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "maharani-smart-store-api" }));
app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

await connectDB();
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
