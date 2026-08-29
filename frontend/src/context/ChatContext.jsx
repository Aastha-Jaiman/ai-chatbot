"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getConversations,
  createConversation,
  getConversation,
  deleteConversation,
  renameConversation,
  getMessages,
  sendMessage,
  togglePinConversation,
} from "@/lib/api/chat";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.conversationId;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const skipFetchIdRef = useRef(null);

  // Fetch all conversations for sidebar
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const data = await getConversations();
      // Backend returns: { success: true, conversations: [...] }
      setConversations(data.conversations || data || []);
    } catch (error) {
      console.error("Fetch conversations error:", error);
      toast.error("Failed to load conversation list");
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoadingMessages(true);
      const data = await getMessages(id);
      setMessages(data.messages || data || []);
    } catch (error) {
      console.error("Fetch messages error:", error);
      // Redirect to home if conversation load fails (e.g. deleted)
      router.push("/");
    } finally {
      setLoadingMessages(false);
    }
  }, [router]);

  // Load conversations once on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Sync messages when active conversationId parameter changes
  useEffect(() => {
    if (conversationId) {
      if (skipFetchIdRef.current === conversationId) {
        // Clear the ref and skip fetch to allow sendNewMessage to populate state
        skipFetchIdRef.current = null;
        return;
      }
      fetchMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId, fetchMessages]);

  // Handle creating a new chat session
  const startNewChat = useCallback(() => {
    router.replace("/");
  }, [router]);

  // Send a user message and retrieve the AI assistant's reply
  const sendNewMessage = useCallback(async (content, attachments = []) => {
    if (!content.trim() && attachments.length === 0) return;

    let activeId = conversationId;

    // Map attachments from frontend structure to the schema expected by chat-service
    const mappedAttachments = attachments.map(att => ({
      fileId: att.id || att._id,
      name: att.originalName || att.filename,
      url: att.url,
      type: att.mimeType,
    }));

    try {
      setSendingMessage(true);

      // 1. If we are on the landing page (/), first create a conversation
      if (!activeId) {
        let title = content;
        if (!title.trim() && attachments.length > 0) {
          title = `Shared File: ${attachments[0].originalName || attachments[0].filename}`;
        }
        const titleToSend = title.length > 30 ? `${title.substring(0, 30)}...` : title;
        const newConvData = await createConversation(titleToSend);
        
        const newConv = newConvData.conversation || newConvData;
        activeId = newConv._id;

        // Optimistically update conversations sidebar
        setConversations(prev => [newConv, ...prev]);
        
        const tempUserMsg = {
          _id: "temp-user",
          role: "user",
          content,
          attachments: mappedAttachments,
          createdAt: new Date().toISOString(),
        };
        setMessages([tempUserMsg]);

        // Prevent premature fetch on routing change
        skipFetchIdRef.current = activeId;
        router.push(`/chat/${activeId}`);

        const response = await sendMessage(activeId, { 
          role: "user", 
          content, 
          attachments: mappedAttachments 
        });
        
        if (response.success) {
          setMessages([response.message, response.reply].filter(Boolean));
        }
        return;
      }

      // 2. Normal flow: We already have an active conversation
      const tempUserMsg = {
        _id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        attachments: mappedAttachments,
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempUserMsg]);

      const response = await sendMessage(activeId, { 
        role: "user", 
        content, 
        attachments: mappedAttachments 
      });

      if (response.success) {
        setMessages(prev => {
          const filtered = prev.filter(m => m._id !== tempUserMsg._id);
          const list = [...filtered, response.message];
          if (response.reply) {
            list.push(response.reply);
          }
          return list;
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to get AI response");
      setMessages(prev => prev.filter(m => !m._id?.toString().startsWith("temp-user")));
    } finally {
      setSendingMessage(false);
      fetchConversations();
    }
  }, [conversationId, router, fetchConversations]);

  // Rename a conversation in the database and UI
  const handleRename = useCallback(async (id, newTitle) => {
    if (!newTitle.trim()) return;
    try {
      await renameConversation(id, newTitle);
      
      setConversations(prev =>
        prev.map(c => (c._id === id ? { ...c, title: newTitle } : c))
      );
      toast.success("Chat renamed");
    } catch (error) {
      console.error("Rename conversation error:", error);
      toast.error("Failed to rename conversation");
    }
  }, []);

  // Delete a conversation in the database and redirect if active
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteConversation(id);
      
      setConversations(prev => prev.filter(c => c._id !== id));
      toast.success("Chat deleted");

      if (conversationId === id) {
        router.push("/");
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
      toast.error("Failed to delete conversation");
    }
  }, [conversationId, router]);

  // Toggle pinning conversation
  const handleTogglePin = useCallback(async (id) => {
    try {
      const data = await togglePinConversation(id);
      if (data.success) {
        setConversations(prev =>
          prev.map(c => (c._id === id ? { ...c, isPinned: data.conversation.isPinned } : c))
        );
        toast.success(data.conversation.isPinned ? "Chat pinned" : "Chat unpinned");
      }
    } catch (error) {
      console.error("Toggle pin conversation error:", error);
      toast.error("Failed to toggle pin conversation");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        conversationId,
        loadingConversations,
        loadingMessages,
        sendingMessage,
        startNewChat,
        sendNewMessage,
        handleRename,
        handleDelete,
        handleTogglePin,
        refreshConversations: fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
