const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.RAG_SERVICE_URL || "http://localhost:4005",
    changeOrigin: true,

    pathRewrite: {
      "^/": "/rag/",
    },
  })
);

module.exports = router;
