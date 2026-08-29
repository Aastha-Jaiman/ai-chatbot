const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const ragRoutes = require("./routes/rag.routes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

connectDB();

app.use("/rag", ragRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "rag-service",
    message: "RAG service is running",
  });
});

const PORT = process.env.PORT || 4005;

app.listen(PORT, () => {
  console.log(`RAG service running on port ${PORT}`);
});