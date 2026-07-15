import type {
  ChatMessage,
  ChatOptions,
  ChatRequest,
  ChatResponse,
  ChatUsage,
  OpenAIChatCompletionResponse,
} from '@/types/ai';
import type { ServiceResult } from '@/types/api';
import { ServiceError, wrapService } from '@/types/api';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

/** Read OpenAI settings from Vite env */
export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY ?? '';
  const model = import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4.1-mini';
  return { apiKey, model };
}

export function isOpenAIConfigured(): boolean {
  return Boolean(getOpenAIConfig().apiKey);
}

function requireApiKey(): string {
  const { apiKey } = getOpenAIConfig();
  if (!apiKey) {
    throw new ServiceError(
      'OpenAI API key is not configured. Set VITE_OPENAI_API_KEY in .env',
      'AI_KEY_MISSING',
    );
  }
  return apiKey;
}

function validateMessages(messages: ChatMessage[]): void {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ServiceError('At least one message is required', 'VALIDATION');
  }
  for (const msg of messages) {
    if (!msg.role || !msg.content?.trim()) {
      throw new ServiceError('Each message must have a role and non-empty content', 'VALIDATION');
    }
  }
}

function mapUsage(usage: OpenAIChatCompletionResponse['usage']): ChatUsage | undefined {
  if (!usage) return undefined;
  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  };
}

function parseCompletionResponse(data: OpenAIChatCompletionResponse): ChatResponse {
  if (data.error) {
    throw parseOpenAIErrorBody(data.error, 400);
  }

  const choice = data.choices?.[0];
  if (!choice) {
    throw new ServiceError('OpenAI returned no choices', 'AI_EMPTY_RESPONSE');
  }

  return {
    content: choice.message?.content ?? '',
    model: data.model,
    usage: mapUsage(data.usage),
    finishReason: choice.finish_reason,
  };
}

function parseOpenAIErrorBody(
  body: unknown,
  httpStatus: number,
): ServiceError {
  const record = body as { error?: { message?: string; type?: string; code?: string }; message?: string };
  const message =
    record?.error?.message ?? record?.message ?? `OpenAI request failed (${httpStatus})`;
  const code = record?.error?.code ?? record?.error?.type;

  if (httpStatus === 401 || code === 'invalid_api_key') {
    return new ServiceError(message, 'AI_KEY_INVALID', body);
  }
  if (httpStatus === 429 || code === 'rate_limit_exceeded') {
    return new ServiceError(message, 'AI_RATE_LIMIT', body);
  }
  if (httpStatus >= 500) {
    return new ServiceError(message, 'AI_SERVER_ERROR', body);
  }
  return new ServiceError(message, 'AI_REQUEST_FAILED', body);
}

async function requestChatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<ChatResponse> {
  validateMessages(messages);
  const apiKey = requireApiKey();
  const { model: defaultModel } = getOpenAIConfig();

  const payload: Record<string, unknown> = {
    model: options.model ?? defaultModel,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };

  if (options.temperature != null) payload.temperature = options.temperature;
  if (options.maxTokens != null) payload.max_tokens = options.maxTokens;
  if (options.jsonMode) payload.response_format = { type: 'json_object' };

  let response: Response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ServiceError('Request was cancelled', 'AI_ABORTED', error);
    }
    throw new ServiceError(
      error instanceof Error ? error.message : 'Network request failed',
      'NETWORK',
      error,
    );
  }

  let data: OpenAIChatCompletionResponse;
  try {
    data = (await response.json()) as OpenAIChatCompletionResponse;
  } catch {
    throw new ServiceError('Failed to parse OpenAI response', 'AI_PARSE_ERROR', {
      status: response.status,
    });
  }

  if (!response.ok) {
    throw parseOpenAIErrorBody(data, response.status);
  }

  return parseCompletionResponse(data);
}

/**
 * Send a chat completion request to OpenAI.
 * @throws {ServiceError} on validation, network, or API errors
 */
export async function chat(
  messages: ChatMessage[],
  options?: ChatOptions,
): Promise<ChatResponse> {
  return requestChatCompletion(messages, options);
}

/**
 * Non-throwing variant — returns `{ data, error }` for UI layers.
 */
export async function chatSafe(request: ChatRequest): Promise<ServiceResult<ChatResponse>> {
  return wrapService(() => chat(request.messages, request.options));
}
