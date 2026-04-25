import type { SuccessResponse } from './apiResponse';

export interface AuthUser {
    userId: string;
    email: string;
    name: string;
}

export interface RegisterRequest {
    email: string;  
    password: string;
    name: string;
}

export interface RegisterData {
    user: AuthUser;
    token: string;
}

export type RegisterResponse = SuccessResponse<RegisterData>;

export interface LoginRequest {
    email: string;
    password: string;       
}

export interface LoginData {
    user: AuthUser;
    token: string;
    expiresIn: number; // Expiration time in seconds
}

export type LoginResponse = SuccessResponse<LoginData>;

export interface GetMeData {
    user: AuthUser;
}

export type GetMeResponse = SuccessResponse<GetMeData>;