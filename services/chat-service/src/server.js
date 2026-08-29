const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");

dotenv.config();

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

connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "chat-service",
    message: "Chat service is running",
  });
});

app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
});