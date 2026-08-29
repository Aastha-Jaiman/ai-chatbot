"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Edit2, Trash2, Check, X, Pin } from "lucide-react";

export default function ConversationItem({
  conversation,
  isActive,
  onRename,
  onDelete,
  onTogglePin,
  onClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title || "New Chat");
  const inputRef = useRef(null);

  useEffect(() => {
    setTitle(conversation.title || "New Chat");
  }, [conversation.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (title.trim() && title !== conversation.title) {
      onRename(conversation._id, title.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTitle(conversation.title || "New Chat");
    setIsEditing(false);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      onDelete(conversation._id);
    }
  };

  return (
    <div className="group relative">
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="flex items-center gap-1 rounded-lg bg-bg-sidebar-active p-1 px-2 border border-border-sidebar"
        >
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel(e);
            }}
            className="flex-1 bg-transparent text-sm text-text-sidebar outline-none w-full"
          />
          <button
            type="submit"
            className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1 text-rose-400 hover:text-rose-300 rounded"
          >
            <X size={14} />
          </button>
        </form>
      ) : (
        <Link
          href={`/chat/${conversation._id}`}
          onClick={onClick}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
            isActive
              ? "bg-bg-sidebar-active text-white font-semibold shadow-inner border-l-2 border-brand-primary"
              : "text-text-sidebar-muted hover:bg-bg-sidebar-hover hover:text-white"
          }`}
        >
          <MessageSquare size={16} className={isActive ? "text-brand-primary" : "text-text-sidebar-muted"} />
          <span className="truncate pr-16">{title}</span>

          {/* Action buttons shown on hover */}
          <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity duration-200 ${
            conversation.isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTogglePin(conversation._id);
              }}
              className={`p-1 rounded hover:bg-bg-sidebar bg-transparent transition ${
                conversation.isPinned ? "text-amber-500 hover:text-amber-400" : "text-text-sidebar-muted hover:text-text-sidebar"
              }`}
              title={conversation.isPinned ? "Unpin conversation" : "Pin conversation"}
            >
              <Pin size={13} className={conversation.isPinned ? "fill-amber-500" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 text-text-sidebar-muted hover:text-text-sidebar rounded hover:bg-bg-sidebar bg-transparent transition"
              title="Rename conversation"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 text-text-sidebar-muted hover:text-rose-400 rounded hover:bg-bg-sidebar bg-transparent transition"
              title="Delete conversation"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}
