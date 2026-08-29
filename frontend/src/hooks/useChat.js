"use client";

import { useChatContext } from "@/context/ChatContext";

export function useChat() {
  return useChatContext();
}
