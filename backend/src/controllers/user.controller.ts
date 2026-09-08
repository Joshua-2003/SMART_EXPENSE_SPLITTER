import type { NextFunction, Request, Response } from 'express';

import * as userService from '../services/user.service.js';

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await userService.getProfile(userId);

    res.status(200).json({
      status: 'success',
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        createdAt: result.createdAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await userService.updateProfile(actorId, req.params.userId, {
      name: req.body.name,
      email: req.body.email,
    });

    res.status(200).json({
      status: 'success',
      data: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        updatedAt: result.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}