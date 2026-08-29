require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://geminiai-chatbot-assistant.vercel.app",
    ],
  })
);
app.use(express.json());

// MongoDB
connectDB();

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "file-service",
    message: "File service is running",
  });
});

// Static files
app.use(
  "/files/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// File routes
app.use("/files", fileRoutes);

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`File service running on port ${PORT}`);
});