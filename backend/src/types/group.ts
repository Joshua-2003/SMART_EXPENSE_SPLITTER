export interface CreateGroupInput {
  name: string;
  description?: string;
}

export interface CreateGroupResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  createdAt: Date;
}

export interface ListGroupsInput {
  limit?: number;
  offset?: number;
}

export interface GroupListItem {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  role: 'admin' | 'member';
  memberCount: number;
  createdAt: Date;
}

export interface ListGroupsResult {
  groups: GroupListItem[];
  total: number;
  limit: number;
  offset: number;
}