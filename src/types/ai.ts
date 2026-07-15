/** OpenAI chat message roles */
export type ChatRole = 'system' | 'user' | 'assistant' | 'developer';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatOptions {
  /** Override default model (env: VITE_OPENAI_MODEL) */
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** Request JSON object response via response_format */
  jsonMode?: boolean;
  /** Abort long-running requests */
  signal?: AbortSignal;
}

export interface ChatUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: ChatUsage;
  finishReason: string | null;
}

export interface ChatRequest {
  messages: ChatMessage[];
  options?: ChatOptions;
}

/** Raw OpenAI chat/completions response (subset) */
export interface OpenAIChatCompletionResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string | null };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: { message: string; type?: string; code?: string };
}
