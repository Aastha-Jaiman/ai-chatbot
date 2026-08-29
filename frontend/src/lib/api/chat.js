import apiClient from "./client";

export const createConversation = async (title) => {
  const response = await apiClient.post(
    "/chat/conversations",
    {
      title,
    }
  );

  return response.data;
};

export const getConversations = async () => {
  const response = await apiClient.get(
    "/chat/conversations"
  );

  return response.data;
};

export const getConversation = async (
  conversationId
) => {
  const response = await apiClient.get(
    `/chat/conversations/${conversationId}`
  );

  return response.data;
};

export const renameConversation = async (
  conversationId,
  title
) => {
  const response = await apiClient.patch(
    `/chat/conversations/${conversationId}`,
    {
      title,
    }
  );

  return response.data;
};

export const deleteConversation = async (
  conversationId
) => {
  const response = await apiClient.delete(
    `/chat/conversations/${conversationId}`
  );

  return response.data;
};

export const getMessages = async (
  conversationId
) => {
  const response = await apiClient.get(
    `/chat/messages/${conversationId}`
  );

  return response.data;
};

export const sendMessage = async (
  conversationId,
  messageData
) => {
  const response = await apiClient.post(
    `/chat/messages/${conversationId}`,
    messageData
  );

  return response.data;
};

export const togglePinConversation = async (
  conversationId
) => {
  const response = await apiClient.patch(
    `/chat/conversations/${conversationId}/pin`
  );

  return response.data;
};