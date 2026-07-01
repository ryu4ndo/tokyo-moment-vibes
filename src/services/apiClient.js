export class ApiError extends Error {
  constructor(message, detail = null) {
    super(message);
    this.name = 'ApiError';
    this.detail = detail;
  }
}

export async function postApi(path, body) {
  let response;
  let rawText = '';

  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    rawText = await response.text();
  } catch (error) {
    throw new ApiError('APIサーバーへの接続に失敗しました', {
      step: path,
      message: error.message,
      errorName: error.name,
      httpStatus: null,
      errorCode: 'FETCH_FAILED',
      responseBody: null,
      cause: error.cause?.message ?? null,
      env: null,
    });
  }

  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new ApiError('APIレスポンスの解析に失敗しました', {
      step: path,
      message: 'Invalid JSON response',
      errorName: 'ParseError',
      httpStatus: response.status,
      errorCode: 'INVALID_JSON',
      responseBody: rawText.slice(0, 2000),
      env: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(data.error ?? 'リクエストに失敗しました', data.detail ?? {
      step: path,
      message: data.error ?? 'リクエストに失敗しました',
      httpStatus: response.status,
      responseBody: rawText.slice(0, 2000),
      env: null,
    });
  }

  return data;
}

export async function getApi(path) {
  let response;
  let rawText = '';

  try {
    response = await fetch(path);
    rawText = await response.text();
  } catch (error) {
    throw new ApiError('APIサーバーへの接続に失敗しました', {
      step: path,
      message: error.message,
      errorName: error.name,
      httpStatus: null,
      errorCode: 'FETCH_FAILED',
      responseBody: null,
      env: null,
    });
  }

  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new ApiError('APIレスポンスの解析に失敗しました', {
      step: path,
      httpStatus: response.status,
      responseBody: rawText.slice(0, 2000),
      env: null,
    });
  }

  if (!response.ok) {
    throw new ApiError(data.error ?? 'リクエストに失敗しました', data.detail ?? {
      step: path,
      httpStatus: response.status,
      responseBody: rawText.slice(0, 2000),
      env: null,
    });
  }

  return data;
}
