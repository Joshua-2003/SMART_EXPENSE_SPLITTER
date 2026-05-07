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