import type { NextFunction, Request, Response } from 'express';

import * as groupService from '../services/group.service.js';

export async function createGroup(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await groupService.createGroup(actorId, {
      name: req.body.name,
      description: req.body.description,
    });

    res.status(201).json({
      status: 'success',
      data: {
        groupId: result.groupId,
        name: result.name,
        description: result.description,
        adminId: result.adminId,
        createdAt: result.createdAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}