import { Request, Response } from 'express';
import * as groupService from '@/services/groupService.js';
import { sendSuccess, sendError } from '@/utils/responseUtils.js';
import { AuthenticationError, ConflictError } from '@/utils/errorUtils.js';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware.js';

export async function getGroupById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { groupId } = req.params;
        const group = await groupService.getGroupById(groupId);
        sendSuccess(res, 200, group);
    } catch (error) {
        if (error instanceof AuthenticationError) {
            sendError(res, 401, 'Unauthorized');
        } else {
            sendError(res, 500, 'Internal server error');
        }
    }
}

export async function createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, description } = req.body;
        const adminId = req.userId!; // Set by authMiddleware

        const result = await groupService.createGroup({ name, description, adminId });
        sendSuccess(res, 201, result);
    } catch (error) {
        if (error instanceof AuthenticationError) {
            sendError(res, 401, 'Unauthorized');
        } else if (error instanceof ConflictError) {
            sendError(res, 409, 'Group creation failed');
        } else {
            sendError(res, 500, 'Internal server error');
        }
    }
}

