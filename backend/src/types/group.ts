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

export interface GroupMemberItem {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface GroupDetailsResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  members: GroupMemberItem[];
  createdAt: Date;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
}

export interface UpdateGroupResult {
  groupId: string;
  name: string;
  description: string | null;
  updatedAt: Date;
}