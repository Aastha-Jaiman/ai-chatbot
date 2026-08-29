"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/sidebar/Sidebar";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatLayout({ children }) {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <div className="flex h-screen overflow-hidden bg-bg-primary text-text-primary">
          <Sidebar />

          <main className="flex min-w-0 flex-1 flex-col bg-bg-primary">
            {children}
          </main>
        </div>
      </ChatProvider>
    </ProtectedRoute>
  );
}