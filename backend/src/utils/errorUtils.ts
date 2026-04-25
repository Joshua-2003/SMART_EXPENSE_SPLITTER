/**
 * Custom Error Classes
 * 
 * Custom error types for API responses
 */

export class AppError extends Error { // AppError is the child of the built-in Error class in JavaScript. So it can inherit the method and properties of the Error class, such as message and stack trace (yung listahan kung saang file at line nag-error).
  public readonly statusCode: number;
  public readonly isOperational: boolean; // isOperational is a flag to indicate whether the error is an expected operational error (like validation failure, authentication failure, etc.) or an unexpected programming error (like null reference, syntax error, etc.). This can help us decide how to handle the error in the error handler middleware.

  // constructor will run when we create a new instance of AppError or its subclasses. It takes a message, status code, and isOperational flag as parameters and initializes the error object accordingly. It also captures the stack trace for better debugging
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message); // Call the parent constructor (Error) with the message to set the error message property 
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype); // Nilalagay ito para kapag nag-check ka ng if (err instanceof AppError), mag-re-return ito ng true. Kung wala ito, is baka isipin ng system na generic Error lang siya.

    // stack trace - Ito yung listahan ng mga file at function lines na dinaanan bago nag-error.
    Error.captureStackTrace(this, this.constructor); // So helpful ito for debugging para makita lang natin kung saan sa code nag-error nang hindi na kailangang mag-log ng buong error object.
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
