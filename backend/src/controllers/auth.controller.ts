import type { Request, Response, NextFunction } from 'express';

import * as authService from '../services/auth.service.js';

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.signup({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });

    res.status(201).json({
      status: 'success',
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        token: result.token,
        createdAt: result.createdAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
