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

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
}

export interface AddMemberPayload {
  email: string;
}
