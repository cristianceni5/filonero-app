import type { Conversation, Message } from "@/src/types/domain";
import { apiRequest } from "./client";

export async function listConversations(accessToken: string): Promise<Conversation[]> {
  const response = await apiRequest<{ conversations: Conversation[] }>("/conversations", {
    token: accessToken
  });
  return response.conversations;
}

export async function getConversation(accessToken: string, conversationId: string): Promise<Conversation> {
  const response = await apiRequest<{ conversation: Conversation }>(`/conversations/${conversationId}`, {
    token: accessToken
  });
  return response.conversation;
}

export async function createDirectConversation(accessToken: string, otherUserId: string): Promise<Conversation> {
  const response = await apiRequest<{ conversation: Conversation }>("/conversations", {
    method: "POST",
    token: accessToken,
    body: { otherUserId }
  });
  return response.conversation;
}

export async function listMessages(accessToken: string, conversationId: string): Promise<Message[]> {
  const response = await apiRequest<{ messages: Message[] }>(`/conversations/${conversationId}/messages`, {
    token: accessToken
  });
  return response.messages;
}

export async function sendMessage(
  accessToken: string,
  conversationId: string,
  body: string
): Promise<Message> {
  const response = await apiRequest<{ message: Message }>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    token: accessToken,
    body: { body }
  });
  return response.message;
}
