export type ServiceErrorCode =
  | 'NETWORK'
  | 'AUTH'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SUPABASE_DISABLED'
  | 'AI_KEY_MISSING'
  | 'AI_KEY_INVALID'
  | 'AI_RATE_LIMIT'
  | 'AI_SERVER_ERROR'
  | 'AI_REQUEST_FAILED'
  | 'AI_EMPTY_RESPONSE'
  | 'AI_PARSE_ERROR'
  | 'AI_ABORTED'
  | 'UNKNOWN';

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  readonly cause?: unknown;

  constructor(message: string, code: ServiceErrorCode = 'UNKNOWN', cause?: unknown) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.cause = cause;
  }
}

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
}

export function ok<T>(data: T): ServiceResult<T> {
  return { data, error: null };
}

export function err<T = never>(error: ServiceError): ServiceResult<T> {
  return { data: null, error };
}

export async function wrapService<T>(fn: () => Promise<T>): Promise<ServiceResult<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof ServiceError) return err(e);
    return err(new ServiceError(e instanceof Error ? e.message : 'Unknown error', 'UNKNOWN', e));
  }
}
