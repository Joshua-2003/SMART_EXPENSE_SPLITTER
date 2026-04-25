import { Request, Response, NextFunction } from 'express';

/**
 * Error handler middleware placeholder
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Implementation will be added by Backend Implementation Agent
  console.error(err);
};

/**
 * Not found handler middleware placeholder
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Implementation will be added by Backend Implementation Agent
};

export {};
