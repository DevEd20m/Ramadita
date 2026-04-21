import * as cloudLogger from 'firebase-functions/logger';

export type LogContext = Record<string, unknown>;

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === 'object' && error !== null) {
    return { ...error };
  }

  return { error };
}

export const logger = {
  debug(message: string, context: LogContext = {}): void {
    cloudLogger.debug(message, context);
  },

  info(message: string, context: LogContext = {}): void {
    cloudLogger.info(message, context);
  },

  warn(message: string, context: LogContext = {}): void {
    cloudLogger.warn(message, context);
  },

  error(message: string, error?: unknown, context: LogContext = {}): void {
    cloudLogger.error(message, {
      ...context,
      error: error ? serializeError(error) : undefined,
    });
  },

  serializeError,
};
