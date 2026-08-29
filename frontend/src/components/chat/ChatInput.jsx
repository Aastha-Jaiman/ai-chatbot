// components/ChatInput.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  ArrowUp,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile, deleteFile } from "@/lib/api/file";

export default function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  // Handle file selection + upload
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    const allowedExtensions = ["pdf", "doc", "docx", "txt", "png", "jpg", "jpeg", "webp"];

    const validFiles = [];
    for (const file of files) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isAllowed =
        allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

      if (!isAllowed) {
        toast.error(
          `"${file.name}" is not an allowed file type. Only PDF, DOC, DOCX, TXT and image files are allowed.`
        );
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 10MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const uploadPromises = validFiles.map(async (file) => {
        const data = await uploadFile(file);
        const uploadedFile = data?.file;
        if (!uploadedFile) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        return uploadedFile;
      });

      const uploadedResults = await Promise.all(uploadPromises);
      setSelectedFiles((prev) => [...prev, ...uploadedResults]);
      toast.success(
        validFiles.length > 1
          ? "All files uploaded successfully"
          : "File uploaded successfully"
      );
    } catch (error) {
      console.error("Multiple file upload error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload one or more files"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = async (fileId) => {
    try {
      await deleteFile(fileId);
      setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Failed to delete file:", error);
      setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
      toast.error("Failed to delete file from server");
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if ((!message.trim() && selectedFiles.length === 0) || disabled || uploading) {
      return;
    }

    onSend(message.trim(), selectedFiles);

    setMessage("");
    setSelectedFiles([]);

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // On mobile, Enter should insert a newline (soft keyboards send Enter
    // for "go/done" too), so only auto-send on Enter for non-touch/desktop.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border-color bg-chat-bg p-2.5 sm:p-4 md:p-5 smooth-transition">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl min-w-0 rounded-3xl sm:rounded-[28px] border border-border-color bg-bg-primary p-1.5 sm:p-2 shadow-md transition-all duration-200 focus-within:border-brand-primary/50 focus-within:ring-2 focus-within:ring-brand-light/30"
      >
        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 px-1.5 sm:px-2 pt-1 flex flex-wrap gap-2">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="flex max-w-full items-center gap-2 rounded-2xl border border-border-color bg-bg-secondary px-2.5 sm:px-3 py-1.5 animate-message"
              >
                {file.mimeType?.startsWith("image/") ? (
                  <ImageIcon size={15} className="shrink-0 text-brand-primary" />
                ) : (
                  <FileText size={15} className="shrink-0 text-brand-primary" />
                )}

                <div className="min-w-0 max-w-[110px] sm:max-w-[150px]">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {file.originalName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  disabled={disabled || uploading}
                  className="shrink-0 rounded-full p-0.5 text-text-secondary hover:bg-bg-primary hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40 transition cursor-pointer"
                  title="Remove file"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-1.5 sm:gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
            onChange={handleFileSelect}
          />

          {/* Attachment button */}
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 rounded-full p-2 sm:p-2.5 text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            title="Attach file"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin text-brand-primary" />
            ) : (
              <Paperclip size={18} />
            )}
          </button>

          {/* Message textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please wait for response..." : "Message Gemini..."}
            disabled={disabled || uploading}
            rows={1}
            className="max-h-40 min-w-0 flex-1 resize-none bg-transparent px-1.5 sm:px-2 py-2 text-sm leading-relaxed text-text-primary outline-none placeholder-text-secondary disabled:cursor-not-allowed"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={(!message.trim() && selectedFiles.length === 0) || disabled || uploading}
            className={`flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-all duration-200 cursor-pointer ${
              (message.trim() || selectedFiles.length > 0) && !disabled && !uploading
                ? "bg-brand-primary hover:bg-brand-secondary active:scale-95 text-white"
                : "cursor-not-allowed bg-border-color text-text-secondary/50 opacity-40"
            }`}
            title="Send message"
          >
            <ArrowUp size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </form>
    </div>
  );
}