// ChatWindow.jsx
"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Sparkles, Cpu, Paintbrush, ChevronDown, Pin, MoreVertical, Edit2, Trash2, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";

export default function ChatWindow() {
  const { user } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showChatActionsMenu, setShowChatActionsMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const triggerRenameModal = () => {
    setNewChatTitle(activeConversation?.title || "");
    setShowRenameModal(true);
  };

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/chat/${conversationId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Share link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy share link:", err);
        toast.error("Failed to copy share link");
      });
  };

  const {
    conversations,
    conversationId,
    messages,
    loadingMessages,
    sendingMessage,
    sendNewMessage,
    handleTogglePin,
    handleRename,
    handleDelete,
  } = useChat();

  const activeConversation = conversations.find((c) => c._id === conversationId);
  const chatTitle = activeConversation ? activeConversation.title : "New Conversation";

  const starterPrompts = [
    {
      icon: "💡",
      title: "Brainstorm ideas",
      desc: "for a creative coding project name",
      prompt: "Brainstorm 5 creative and unique names for an AI chatbot project, along with a short tagline for each.",
    },
    {
      icon: "✍️",
      title: "Draft an email",
      desc: "requesting team project updates",
      prompt: "Draft a professional yet friendly email to my development team requesting status updates on our pending sprint items.",
    },
    {
      icon: "💻",
      title: "Debug / Write Code",
      desc: "implementing a search algorithm",
      prompt: "Write a clean JavaScript function to perform a binary search on a sorted array, including JSDoc comments.",
    },
    {
      icon: "🔬",
      title: "Explain a concept",
      desc: "quantum physics for beginners",
      prompt: "Explain the concept of quantum superposition in simple, intuitive terms suitable for a 10-year old child.",
    },
  ];

  const ThemeSwitcher = () => (
    <div className="relative shrink-0">
      <button
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        className="flex items-center gap-1.5 rounded-full border border-border-color bg-bg-primary px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-text-primary shadow-sm hover:bg-bg-secondary transition active:scale-95 cursor-pointer"
        title="Change theme"
      >
        <Paintbrush size={12} className="text-brand-primary" />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${
            showThemeMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {showThemeMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowThemeMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-44 sm:w-48 max-w-[80vw] origin-top-right rounded-xl border border-border-color bg-bg-primary p-1.5 shadow-xl z-50 animate-message">
            <p className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
              Select Theme
            </p>
            <div className="space-y-0.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemeMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition cursor-pointer ${
                    theme === t.id
                      ? "bg-brand-light text-brand-primary font-semibold"
                      : "text-text-primary hover:bg-bg-secondary"
                  }`}
                >
                  <span>{t.name}</span>
                  {theme === t.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const ChatActionsDropdown = () => {
    const isPinned = activeConversation?.isPinned;
    return (
      <div className="relative shrink-0">
        <button
          onClick={() => setShowChatActionsMenu(!showChatActionsMenu)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-color bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition active:scale-95 cursor-pointer"
          title="Chat settings"
        >
          <MoreVertical size={16} />
        </button>

        {showChatActionsMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowChatActionsMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border-color bg-bg-primary p-1.5 shadow-xl z-50 animate-message">
              <p className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                Chat Options
              </p>
              <div className="space-y-0.5">
                {/* Pin / Unpin option */}
                <button
                  onClick={() => {
                    handleTogglePin(conversationId);
                    setShowChatActionsMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-text-primary hover:bg-bg-secondary transition cursor-pointer"
                >
                  <Pin size={13} className={isPinned ? "text-amber-500 fill-amber-500" : "text-text-secondary"} />
                  <span>{isPinned ? "Unpin Chat" : "Pin Chat"}</span>
                </button>

                {/* Share Chat option */}
                <button
                  onClick={() => {
                    handleShareClick();
                    setShowChatActionsMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-text-primary hover:bg-bg-secondary transition cursor-pointer"
                >
                  <Share2 size={13} className="text-text-secondary" />
                  <span>Share Chat</span>
                </button>

                {/* Rename/Edit option */}
                <button
                  onClick={() => {
                    setShowChatActionsMenu(false);
                    triggerRenameModal();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-text-primary hover:bg-bg-secondary transition cursor-pointer"
                >
                  <Edit2 size={13} className="text-text-secondary" />
                  <span>Rename Chat</span>
                </button>

                <hr className="my-1 border-border-color" />

                {/* Delete option */}
                <button
                  onClick={() => {
                    setShowChatActionsMenu(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <Trash2 size={13} className="text-rose-500" />
                  <span>Delete Chat</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-chat-bg text-text-primary smooth-transition relative w-full min-w-0 overflow-hidden">
      {/* Header (only when a conversation is active) */}
      {conversationId && (
        <header className="border-b border-border-color bg-bg-primary pl-16 pr-3 py-3 md:pl-6 md:pr-6 md:py-4 shadow-sm flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
              <Cpu size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-text-primary text-sm truncate">
                {chatTitle}
              </h2>
              <p className="hidden sm:flex text-[10px] text-text-secondary font-medium items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.5 Flash Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChatActionsDropdown />
            <ThemeSwitcher />
          </div>
        </header>
      )}

      {/* Landing / Starter screen */}
      {!conversationId ? (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-16 pb-8 md:pt-12 md:pb-12 flex flex-col justify-between relative">
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <ThemeSwitcher />
          </div>

          <div className="mx-auto max-w-2xl w-full text-center my-auto">
            <div className="mx-auto mb-5 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg shadow-brand-primary/20 animate-bounce">
              <Sparkles size={26} className="text-white" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight px-2">
              Hello, {user?.name ? user.name.split(" ")[0] : "there"}!
            </h1>

            <p className="mt-3 text-sm sm:text-base text-text-secondary font-medium px-2">
              I'm your assistant, powered by Gemini. How can I help you today?
            </p>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 text-left">
              {starterPrompts.map((starter, index) => (
                <button
                  key={index}
                  onClick={() => sendNewMessage(starter.prompt)}
                  className="group flex flex-col rounded-2xl border border-border-color bg-bg-primary p-4 sm:p-5 hover-lift smooth-transition text-left hover:border-brand-primary/50 hover:bg-bg-secondary cursor-pointer"
                >
                  <span className="text-xl sm:text-2xl mb-2">{starter.icon}</span>
                  <h3 className="font-semibold text-text-primary text-sm group-hover:text-brand-primary transition">
                    {starter.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                    {starter.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-[11px] sm:text-xs text-text-secondary font-medium mt-8">
            Your conversations are secure and encrypted.
          </div>
        </div>
      ) : loadingMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-chat-bg">
          <Loader2 />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          <MessageList messages={messages} sendingMessage={sendingMessage} />
        </div>
      )}

      {/* Chat input footer */}
      <div className="shrink-0 px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
        <ChatInput onSend={sendNewMessage} disabled={sendingMessage || loadingMessages} />
      </div>

      {/* Rename Chat Custom Overlay Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-message">
          <div className="w-full max-w-md rounded-2xl border border-border-color bg-bg-primary p-6 shadow-2xl">
            <h3 className="text-base font-bold text-text-primary">Rename Conversation</h3>
            <p className="mt-1.5 text-xs text-text-secondary">
              Enter a new title for this conversation session:
            </p>
            <input
              type="text"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="mt-4 w-full rounded-xl border border-border-color bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-primary/50 transition"
              placeholder="Chat title..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (newChatTitle.trim()) {
                    handleRename(conversationId, newChatTitle.trim());
                    setShowRenameModal(false);
                  }
                }
              }}
              autoFocus
            />
            <div className="mt-6 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setShowRenameModal(false)}
                className="rounded-xl border border-border-color bg-transparent px-4 py-2 text-text-primary hover:bg-bg-secondary transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newChatTitle.trim()) {
                    handleRename(conversationId, newChatTitle.trim());
                    setShowRenameModal(false);
                  }
                }}
                disabled={!newChatTitle.trim()}
                className="rounded-xl bg-brand-primary px-4 py-2 text-white hover:bg-brand-secondary transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Custom Overlay Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-message">
          <div className="w-full max-w-md rounded-2xl border border-border-color bg-bg-primary p-6 shadow-2xl">
            <h3 className="text-base font-bold text-rose-500 flex items-center gap-2">
              <Trash2 size={18} />
              Delete Conversation?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Are you sure you want to delete this chat session? All messages and RAG context associated with this session will be permanently erased. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-border-color bg-transparent px-4 py-2 text-text-primary hover:bg-bg-secondary transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(conversationId);
                  setShowDeleteModal(false);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 transition active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader2() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
      <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider animate-pulse">
        Loading Chat History...
      </span>
    </div>
  );
}