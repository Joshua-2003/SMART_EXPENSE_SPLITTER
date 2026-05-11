export interface CreateGroupInput {
    name: string;
    description?: string;
    adminId: string;
}

export interface GroupResponse {
    id: string;
    name: string;
    description?: string;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GroupMemberResponse {
    userId: string;
    groupId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    user: {
        email: string;
        name: string;
    };
}

export interface GroupDetailsResponse extends GroupResponse {
    members: GroupMemberResponse[];
}