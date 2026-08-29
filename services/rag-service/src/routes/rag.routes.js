const express = require("express");
const {
  processDocument,
  queryDocument,
  deleteDocumentChunks,
} = require("../controllers/rag.controller");

const router = express.Router();

router.post("/process", processDocument);
router.post("/query", queryDocument);
router.delete("/file/:fileId", deleteDocumentChunks);

module.exports = router;
