const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
    changeOrigin: true,

    pathRewrite: {
      "^/": "/auth/",
    },
  })
);

module.exports = router;