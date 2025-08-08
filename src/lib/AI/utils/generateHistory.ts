import { Content } from "@google/genai";
import { Message } from "@prisma/client";

export async function generateModelHistoryFromMessages(
  messages: Message[]
): Promise<Content[]> {
  const history: Content[] = [];

  if (!messages || messages.length === 0) return history;

  const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
  const now = Date.now();

  // filter messages created within the last 15 minutes
  const recentMessages = messages.filter((message) => {
    const messageTime = new Date(message.createdAt).getTime();
    return now - messageTime <= FIFTEEN_MINUTES_MS;
  });

  // sort chronologically
  recentMessages.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  // latest 5 or fewer messages
  const latestMessages = recentMessages.slice(-10);

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
