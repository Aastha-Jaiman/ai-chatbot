const dotenv = require("dotenv");

dotenv.config();

console.log(
  "Gemini API Key loaded:",
  !!process.env.GEMINI_API_KEY
);

const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "ai-service",
    message: "AI service is running",
  });
});

app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});