export type ErrorContext = Record<string, unknown>;

export class AppError extends Error {
  readonly code: string;
  readonly context: ErrorContext;

  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'CONFIGURATION_ERROR', context);
  }
}

export class OpenAIError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'OPENAI_ERROR', context);
  }
}

export class WhatsAppError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'WHATSAPP_ERROR', context);
  }
}

export class SessionError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super(message, 'SESSION_ERROR', context);
  }
}
