import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.routes";
import orderRoutes from "./routes/order.routes";

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);

  // 404 fallback
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  return app;
}
