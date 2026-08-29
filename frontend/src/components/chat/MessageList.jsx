// components/MessageList.jsx
"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages = [], sendingMessage = false }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMessage]);

  return (
    <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-3 py-6 sm:px-4 md:px-6 md:py-8">
      <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-text-secondary">
              No messages yet. Say hello to get started!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))
        )}

        {sendingMessage && (
          <MessageBubble
            message={{
              role: "assistant",
              content: "",
              isTyping: true,
            }}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}