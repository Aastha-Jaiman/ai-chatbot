const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL || "http://localhost:4002",
    changeOrigin: true,
  })
);

module.exports = router;