import apiClient from './axios';
import type { ApiResponseError, ApiResponseSuccess } from '../types/api';
import type {
  CreateGroupPayload,
  CreateGroupResult,
  GroupDetailsApiResult,
  GroupListItem,
  ListGroupsResult,
  UpdateGroupPayload,
  UpdateGroupResult,
} from '../types/group';
import type { Group, GroupMember } from '../types';

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

export interface GroupDetailsResult {
  group: Group;
  members: GroupMember[];
}

export async function getGroupDetails(groupId: string): Promise<GroupDetailsResult> {
  const response = await apiClient.get<ApiResponseSuccess<GroupDetailsApiResult> | ApiResponseError>(
    `/groups/${groupId}`,
  );

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  const { members, ...rest } = body.data;

  return {
    group: {
      id: rest.groupId,
      name: rest.name,
      description: rest.description,
      adminId: rest.adminId,
      memberCount: members.length,
      currencySymbol: '₱',
      createdAt: rest.createdAt,
    },
    members: members.map((m) => ({
      groupId,
      userId: m.userId,
      name: m.name,
      email: m.email,
      role: m.role,
      balance: 0,
      joinedAt: m.joinedAt,
    })),
  };
}

export async function updateGroupDetails(
  groupId: string,
  payload: UpdateGroupPayload,
): Promise<UpdateGroupResult> {
  const response = await apiClient.patch<
    ApiResponseSuccess<UpdateGroupResult> | ApiResponseError
  >(`/groups/${groupId}`, payload);

  const body = response.data;

  if (body.status === 'error') {
    throw new Error(body.message);
  }

  return body.data;
}