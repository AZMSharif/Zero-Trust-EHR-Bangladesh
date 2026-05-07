// ─────────────────────────────────────────────
// Express Server Entry Point
// Bangladesh Zero-Trust EHR
// ─────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security ──
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// ── Body Parsing ──
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Static uploads (dev mode) ──
app.use("/uploads", express.static("uploads"));

// ── API Routes ──
app.use("/api", routes);

// ── Health Check ──
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "ehr-api" });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🏥 EHR API running on http://localhost:${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
