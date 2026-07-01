import { ApiError, postApi } from './apiClient.js';

export { ApiError };

export async function generatePlansWithAI(input) {
  const data = await postApi('/api/generate-plan', input);
  return data.plans ?? [];
}
