const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

/* Load .env before importing routes/services */
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://campus-ai-bridge-4-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Campus AI Skill Bridge Backend Running",
    status: "success",
    aiEngine: "OpenRouter Free Model"
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend URL: http://localhost:${PORT}`);
  console.log(
    `AI Engine: ${
      process.env.OPENROUTER_MODEL ||
      "meta-llama/llama-3.3-70b-instruct:free"
    }`
  );
});