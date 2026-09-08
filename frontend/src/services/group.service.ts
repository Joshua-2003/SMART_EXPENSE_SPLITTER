import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type {
  CreateGroupPayload,
  CreateGroupResult,
  GroupListItem,
  ListGroupsResult,
} from '../types/group';
import type { Group } from '../types';

export async function createGroup(payload: CreateGroupPayload): Promise<CreateGroupResult> {
  const response = await apiClient.post<
    ApiResponseSuccess<CreateGroupResult> | ApiResponseError
  >('/groups', payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}

export interface ListGroupsParams {
  limit?: number;
  offset?: number;
}

function toGroup(item: GroupListItem): Group {
  return {
    id: item.groupId,
    name: item.name,
    description: item.description,
    adminId: item.adminId,
    role: item.role,
    memberCount: item.memberCount,
    currencySymbol: '₱',
    createdAt: item.createdAt,
  };
}

interface ListGroupsResponseData {
  groups: GroupListItem[];
  total: number;
  limit: number;
  offset: number;
}

export async function listGroups(
  params: ListGroupsParams = {},
): Promise<ListGroupsResult> {
  const response = await apiClient.get<ApiResponseSuccess<ListGroupsResponseData> | ApiResponseError>(
    '/groups',
    { params },
  );

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return {
    groups: body.data.groups.map(toGroup),
    total: body.data.total,
    limit: body.data.limit,
    offset: body.data.offset,
  };
}