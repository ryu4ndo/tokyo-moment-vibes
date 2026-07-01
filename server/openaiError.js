export function getEnvStatus() {
  const apiKey = process.env.OPENAI_API_KEY || '';
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  return {
    openaiApiKeyConfigured: Boolean(apiKey),
    openaiApiKeyFormatValid: apiKey.startsWith('sk-'),
    openaiApiKeyPrefix: apiKey ? apiKey.slice(0, 3) : null,
    openaiApiKeyLength: apiKey ? apiKey.length : 0,
    openaiModel: model,
    envSource: apiKey ? 'dotenv (.env)' : 'not loaded',
  };
}

export function formatOpenAIError(error, context = {}) {
  if (error?.detail) {
    return {
      ...error.detail,
      ...context,
      env: context.env ?? error.detail.env ?? getEnvStatus(),
    };
  }
  let responseBody = null;

  if (error?.error) {
    responseBody =
      typeof error.error === 'string'
        ? error.error
        : JSON.stringify(error.error, null, 2);
  }

  const env = context.env ?? getEnvStatus();

  return {
    step: context.step ?? 'openai-request',
    endpoint: context.endpoint ?? null,
    message: error?.message ?? 'Unknown error',
    errorName: error?.name ?? 'Error',
    httpStatus: error?.status ?? null,
    errorCode: error?.code ?? null,
    errorType: error?.type ?? null,
    requestId: error?.requestID ?? error?.requestId ?? null,
    responseBody,
    cause: error?.cause?.message ?? null,
    env,
  };
}

export function createApiError(error, context = {}) {
  const detail = formatOpenAIError(error, context);
  const apiError = new Error(detail.message);
  apiError.name = detail.errorName;
  apiError.status = detail.httpStatus;
  apiError.detail = detail;
  return apiError;
}
