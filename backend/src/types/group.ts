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