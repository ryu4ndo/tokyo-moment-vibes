import { postApi } from './apiClient.js';

export async function sendChatMessage({ messages, context }) {
  return postApi('/api/chat', { messages, context });
}
