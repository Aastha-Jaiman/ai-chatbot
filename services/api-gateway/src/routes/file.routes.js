const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.FILE_SERVICE_URL || "http://localhost:4004",
    changeOrigin: true,

    pathRewrite: {
      "^/": "/files/",
    },
  })
);

module.exports = router;