const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const fileController = require("../controllers/file.controller");

const router = express.Router();

// Route for file upload
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  fileController.uploadFile
);

// Route to get all files of the authenticated user
router.get(
  "/",
  authMiddleware,
  fileController.getUserFiles
);

// Route to delete a file
router.delete(
  "/:id",
  authMiddleware,
  fileController.deleteFile
);

module.exports = router;