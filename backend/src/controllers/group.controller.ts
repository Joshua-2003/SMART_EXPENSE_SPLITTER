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

export async function getGroupDetails(
  req: Request<{ groupId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await groupService.getGroupDetails(actorId, req.params.groupId);

    res.status(200).json({
      status: 'success',
      data: {
        groupId: result.groupId,
        name: result.name,
        description: result.description,
        adminId: result.adminId,
        members: result.members.map((member) => ({
          userId: member.userId,
          name: member.name,
          email: member.email,
          role: member.role,
          joinedAt: member.joinedAt.toISOString(),
        })),
        createdAt: result.createdAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function listGroups(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new Error('Authenticated request is missing a user');
    }

    const result = await groupService.listGroups(actorId, {
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
    });

    res.status(200).json({
      status: 'success',
      data: {
        groups: result.groups.map((group) => ({
          groupId: group.groupId,
          name: group.name,
          description: group.description,
          adminId: group.adminId,
          role: group.role,
          memberCount: group.memberCount,
          createdAt: group.createdAt.toISOString(),
        })),
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}