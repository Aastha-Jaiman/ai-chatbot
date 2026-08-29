"use client";

import { useState } from "react";
import { createConversation } from "@/lib/api/chat";

export default function ChatTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCreateChat = async () => {
    try {
      setLoading(true);

      const data = await createConversation(
        "Frontend Test Chat"
      );

      console.log("Create conversation:", data);

      setResult(data);
    } catch (error) {
      console.error(
        "Create conversation failed:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={handleCreateChat}
        disabled={loading}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Creating..."
          : "Create Test Chat"}
      </button>

      {result && (
        <pre className="mt-4 whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}