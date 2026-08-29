const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "auth-service",
    message: "Auth service is running",
  });
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});