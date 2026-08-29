const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const fileRoutes = require("./routes/file.routes");
const ragRoutes = require("./routes/rag.routes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "api-gateway",
    message: "API Gateway is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/rag", ragRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});