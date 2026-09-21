export interface CreateGroupInput {
  name: string;
  description?: string;
}

export interface CreateGroupResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string | null;
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
  adminId: string | null;
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

export interface MemberListItem {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  balance: number;
  joinedAt: Date;
}

export interface ListGroupMembersResult {
  members: MemberListItem[];
}

export interface GroupDetailsResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string | null;
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

export interface AddMemberInput {
  email: string;
}

export interface AddMemberResult {
  userId: string;
  name: string;
  email: string;
  role: 'member';
  joinedAt: Date;
}