const File = require("../models/file.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ai-chatbot-documents",
        resource_type: "raw",
        public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ===============================
// Upload File
// ===============================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log(
      "Uploading file to Cloudinary:",
      req.file.originalname
    );

    // Upload buffer to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    console.log(
      "Cloudinary upload successful:",
      cloudinaryResult.secure_url
    );

    // Save file information in MongoDB
    const file = await File.create({
      userId: req.user.userId,
      originalName: req.file.originalname,
      filename: cloudinaryResult.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
    });

    // ===============================
    // Trigger RAG indexing
    // ===============================

    const ragServiceUrl =
      process.env.RAG_SERVICE_URL || "http://localhost:4005";

    fetch(`${ragServiceUrl}/rag/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: file._id,
        fileUrl: file.url,
        fileName: file.originalName,
        mimeType: file.mimeType,
        userId: req.user.userId,
      }),
    }).catch((err) => {
      console.error(
        "Failed to trigger RAG processing:",
        err.message
      );
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",

      file: {
        id: file._id,
        originalName: file.originalName,
        filename: file.filename,
        mimeType: file.mimeType,
        size: file.size,
        url: file.url,
        createdAt: file.createdAt,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

// ===============================
// Get User Files
// ===============================
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Get files error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

// ===============================
// Delete File
// ===============================
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the file
    const file = await File.findOne({
      _id: id,
      userId: req.user.userId,
    });

    // Check if file exists
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    console.log(
      "Deleting file from Cloudinary:",
      file.path
    );

    // Delete file from Cloudinary
    if (file.path) {
      try {
        await cloudinary.uploader.destroy(file.path, {
          resource_type: "raw",
        });

        console.log(
          "File deleted from Cloudinary:",
          file.path
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary deletion failed:",
          cloudinaryError.message
        );
      }
    }

    // Delete file record from MongoDB
    await File.deleteOne({
      _id: file._id,
    });

    // ===============================
    // Delete RAG chunks
    // ===============================

    const ragServiceUrl =
      process.env.RAG_SERVICE_URL || "http://localhost:4005";

    fetch(`${ragServiceUrl}/rag/file/${file._id}`, {
      method: "DELETE",
    }).catch((err) =>
      console.error(
        "Failed to delete RAG chunks:",
        err.message
      )
    );

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
  deleteFile,
};