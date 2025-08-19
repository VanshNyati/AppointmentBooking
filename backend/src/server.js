import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import router from "./routes.js";
import { handleErrors } from "./utils/errors.js";
import { ensureAdmin, ensureSlotsNext7Days } from "./seed.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });
app.use("/api/register", authLimiter);
app.use("/api/login", authLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", router);
app.use(handleErrors);

const PORT = process.env.PORT || 8080;

(async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Mongo connected");
  await ensureAdmin();
  await ensureSlotsNext7Days(); // idempotent
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
})();
