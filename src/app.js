import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import appRoutes from "./routes/app.routes.js";
import sdkRoutes from "./routes/sdk.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/doc", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/doc.html"));
});

app.use("/auth", authRoutes);
app.use("/apps", appRoutes);
app.use("/sdk", sdkRoutes);
app.use("/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
