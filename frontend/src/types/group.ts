export type MemberRole = 'admin' | 'member';

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  adminId: string;
  memberCount: number;
  currencySymbol: string;
  createdAt: string;
  updatedAt?: string;
  role?: MemberRole;
}

export interface GroupMember {
  id?: string;
  groupId?: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: MemberRole;
  balance: number; // positive = owes, negative = receives
  joinedAt: string;
}

export interface CreateGroupPayload {
  name: string;
  description?: string;
}

export interface CreateGroupResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  createdAt: string;
}

export interface GroupListItem {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  role: MemberRole;
  memberCount: number;
  createdAt: string;
}

export interface ListGroupsResult {
  groups: Group[];
  total: number;
  limit: number;
  offset: number;
}

export interface GroupMemberApiItem {
  userId: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
}

export interface GroupDetailsApiResult {
  groupId: string;
  name: string;
  description: string | null;
  adminId: string;
  members: GroupMemberApiItem[];
  createdAt: string;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
}

export interface AddMemberPayload {
  email: string;
}
