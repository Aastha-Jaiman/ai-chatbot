// Sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";
import ConversationItem from "./ConversationItem";
import {
  Plus,
  MessageSquare,
  LogOut,
  Loader2,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Pin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // desktop icon-only mode

  const {
    conversations,
    conversationId,
    loadingConversations,
    startNewChat,
    handleRename,
    handleDelete,
    handleTogglePin,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
  }, [conversationId]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger toggle (below md only) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-sidebar text-text-sidebar shadow-md md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop, mobile only */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-sidebar bg-bg-sidebar text-text-sidebar h-screen select-none smooth-transition transform transition-all duration-300 ease-in-out
        w-[85vw] max-w-72
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:z-auto md:translate-x-0 md:max-w-none
        ${collapsed ? "md:w-20" : "md:w-72"}`}
      >
        {/* Header section */}
        <div
          className={`flex items-center border-b border-border-sidebar p-4 ${
            collapsed ? "md:justify-center md:px-2" : "justify-between"
          }`}
        >
          <div
            className={`flex min-w-0 items-center gap-2.5 ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-md">
              <Sparkles size={18} className="text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight text-white leading-none">
                Gemini Assistant
              </h1>
              <span className="text-[10px] text-brand-primary font-semibold uppercase tracking-wider">
                Enterprise Chat
              </span>
            </div>
          </div>

          {/* collapsed-mode logo (icon only, desktop) */}
          {collapsed && (
            <div className="hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-md">
              <Sparkles size={18} className="text-white animate-pulse" />
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className="shrink-0 rounded-lg p-1.5 text-text-sidebar-muted hover:bg-bg-sidebar-hover hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse/expand toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex shrink-0 rounded-lg p-1.5 text-text-sidebar-muted hover:bg-bg-sidebar-hover hover:text-white ${
              collapsed ? "md:absolute md:-right-3 md:top-4 md:bg-bg-sidebar md:border md:border-border-sidebar md:rounded-full" : ""
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* New chat action button */}
        <div className={`p-3.5 ${collapsed ? "md:px-2" : ""}`}>
          <button
            onClick={() => {
              startNewChat();
              closeMobile();
            }}
            className={`flex w-full items-center gap-2 rounded-xl border border-border-sidebar bg-bg-sidebar-hover/40 text-sm font-semibold text-text-sidebar shadow-sm transition-all duration-200 hover:bg-bg-sidebar-hover hover:border-border-sidebar/80 hover:text-white active:scale-[0.98] ${
              collapsed
                ? "md:justify-center md:px-0 md:py-3"
                : "justify-center px-4 py-3"
            }`}
            title="New Chat"
          >
            <Plus size={16} />
            <span className={collapsed ? "md:hidden" : ""}>New Chat</span>
          </button>
        </div>

        {/* Search input bar — hidden entirely when collapsed on desktop */}
        {!collapsed ? (
          <div className="px-3.5 mb-3.5">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-sidebar-muted">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border-sidebar bg-bg-sidebar-hover/20 py-2 pl-9 pr-8 text-xs text-text-sidebar placeholder-text-sidebar-muted outline-none transition focus:border-border-sidebar/80 focus:bg-bg-sidebar-hover/40"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 p-1 text-text-sidebar-muted hover:text-white rounded-full bg-transparent hover:bg-bg-sidebar transition cursor-pointer"
                  title="Clear search"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="px-2 mb-3.5 hidden md:flex justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-sidebar bg-bg-sidebar-hover/20 text-text-sidebar-muted hover:text-white hover:bg-bg-sidebar-hover transition cursor-pointer"
              title="Search chats"
            >
              <Search size={16} />
            </button>
          </div>
        )}

        {/* Conversations scroll area — hidden entirely when collapsed on desktop */}
        {!collapsed ? (
          <div className="flex-1 overflow-y-auto px-3.5 pb-4">
            {loadingConversations ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-text-sidebar-muted text-xs">
                <Loader2 size={18} className="animate-spin text-brand-primary" />
                <span>Loading chats...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border-sidebar">
                <MessageSquare size={20} className="text-text-sidebar-muted mb-2" />
                <p className="text-xs text-text-sidebar-muted leading-normal">
                  No chats yet. Start a new conversation above!
                </p>
              </div>
            ) : (() => {
              const filtered = conversations.filter(c =>
                c.title?.toLowerCase().includes(searchTerm.toLowerCase())
              );
              if (filtered.length === 0) {
                return (
                  <div className="py-8 px-4 text-center text-xs text-text-sidebar-muted font-medium">
                    No chats match "{searchTerm}"
                  </div>
                );
              }
              const pinned = filtered.filter(c => c.isPinned);
              const recent = filtered.filter(c => !c.isPinned);

              return (
                <div className="space-y-4">
                  {/* Pinned section */}
                  {pinned.length > 0 && (
                    <div>
                      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                        <Pin size={10} className="fill-amber-500" />
                        Pinned
                      </p>
                      <div className="space-y-1">
                        {pinned.map((conv) => (
                          <div key={conv._id}>
                            <ConversationItem
                              conversation={conv}
                              isActive={conversationId === conv._id}
                              onRename={handleRename}
                              onDelete={handleDelete}
                              onTogglePin={handleTogglePin}
                              onClick={closeMobile}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent section */}
                  {recent.length > 0 && (
                    <div>
                      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-text-sidebar-muted">
                        {pinned.length > 0 ? "All Chats" : "Recent Chats"}
                      </p>
                      <div className="space-y-1">
                        {recent.map((conv) => (
                          <div key={conv._id}>
                            <ConversationItem
                              conversation={conv}
                              isActive={conversationId === conv._id}
                              onRename={handleRename}
                              onDelete={handleDelete}
                              onTogglePin={handleTogglePin}
                              onClick={closeMobile}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          /* Collapsed Pinned list view for desktop */
          <div className="hidden md:flex flex-1 flex-col items-center gap-2.5 overflow-y-auto px-2 pb-4">
            {(() => {
              const pinned = conversations.filter(c => c.isPinned);
              if (pinned.length === 0) return null;
              return (
                <>
                  <div className="my-1 border-t border-border-sidebar/60 w-8" />
                  <p className="text-[8px] font-bold uppercase tracking-wider text-amber-500 text-center" title="Pinned Chats">
                    Pin
                  </p>
                  {pinned.map((conv) => {
                    const initials = conv.title ? conv.title.substring(0, 2).toUpperCase() : "CH";
                    const isActive = conversationId === conv._id;
                    return (
                      <Link
                        key={conv._id}
                        href={`/chat/${conv._id}`}
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition border cursor-pointer ${
                          isActive
                            ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                            : "bg-bg-sidebar-hover/40 text-text-sidebar-muted border-border-sidebar hover:bg-bg-sidebar-hover hover:text-white hover:border-border-sidebar/80"
                        }`}
                        title={conv.title || "Pinned Chat"}
                      >
                        <span>{initials}</span>
                        {/* Small gold pin dot badge */}
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-amber-500 border border-bg-sidebar shadow" />
                      </Link>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}

        {/* When collapsed, show a slim spacer so footer sticks to bottom nicely */}
        {collapsed && <div className="hidden md:block flex-1" />}

        {/* Footer Profile & Logout */}
        <div
          className={`border-t border-border-sidebar p-3.5 bg-bg-sidebar/90 ${
            collapsed ? "md:px-2" : ""
          }`}
        >
          <div
            className={`mb-3 flex items-center rounded-xl bg-bg-sidebar-hover/30 border border-border-sidebar ${
              collapsed
                ? "md:justify-center md:p-2"
                : "gap-3 p-3"
            }`}
            title={user?.name}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className={`min-w-0 flex-1 ${collapsed ? "md:hidden" : ""}`}>
              <p className="truncate text-xs font-semibold text-text-sidebar leading-tight">
                {user?.name}
              </p>
              <p className="truncate text-[10px] text-text-sidebar-muted">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className={`flex w-full items-center rounded-lg py-2 text-sm text-text-sidebar-muted transition hover:bg-bg-sidebar-hover hover:text-rose-400 ${
              collapsed ? "md:justify-center md:px-0" : "gap-2.5 px-3 text-left"
            }`}
            title="Logout"
          >
            <LogOut size={16} />
            <span className={collapsed ? "md:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}