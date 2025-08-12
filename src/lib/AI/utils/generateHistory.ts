import { Content } from "@google/genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Message } from "@prisma/client";

export async function generateConversationalContentFromMessages(
  messages: Message[]
): Promise<Content[]> {
  const history: Content[] = [];

  if (!messages || messages.length === 0) return history;

  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const now = Date.now();

  // filter messages created within the last 5 minutes
  const recentMessages = messages.filter((message) => {
    const messageTime = new Date(message.createdAt).getTime();
    return now - messageTime <= FIVE_MINUTES_MS;
  });

  // sort chronologically
  recentMessages.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  // latest 20 or fewer messages
  const latestMessages = recentMessages.slice(-20);

  let currentRole: "user" | "model" | null = null;
  let currentParts: { text: string }[] = [];

  for (const msg of latestMessages) {
    // Map direction to Gemini role
    const role = msg.direction === "INBOUND" ? "user" : "model";
    // Text fallback if mediaUrl exists and text doesn't
    const messageText =
      msg.text || (msg.mediaUrl ? `[Media] ${msg.mediaUrl}` : "");
    // If role changes, flush current group
    if (role !== currentRole && currentParts.length > 0) {
      history.push({
        role: currentRole!,
        parts: currentParts,
      });
      currentParts = [];
    }
    // Add to current parts
    if (messageText) {
      currentParts.push({ text: messageText });
    }

    currentRole = role;
  }

  // Push any remaining parts
  if (currentParts.length > 0 && currentRole) {
    history.push({
      role: currentRole,
      parts: currentParts,
    });
  }

  return history;
}

export async function generateLangConversationFromMessages(
  messages: Message[]
): Promise<Array<AIMessage | HumanMessage>> {
  const history: Array<AIMessage | HumanMessage> = [];

  if (!messages || messages.length === 0) return history;

  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const now = Date.now();

  // Keep only messages from the last 5 minutes
  const recentMessages = messages.filter((message) => {
    const messageTime = new Date(message.createdAt).getTime();
    return now - messageTime <= FIVE_MINUTES_MS;
  });

  // Sort oldest → newest (chronological)
  recentMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Take only the last 20 messages (still in chronological order)
  const latestMessages = recentMessages.slice(-20);

  for (const msg of latestMessages) {
    const MessageClass = msg.direction === "INBOUND" ? HumanMessage : AIMessage;
    const messageText =
      msg.text || (msg.mediaUrl ? `[Media] ${msg.mediaUrl}` : "");
    history.push(new MessageClass(messageText));
  }

  return history;
}
