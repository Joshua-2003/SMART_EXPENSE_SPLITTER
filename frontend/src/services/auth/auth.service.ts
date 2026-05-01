import api from '@/api/api';
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, GetMeResponse } from '@/types/auth';

export const authService = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>('/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    getMe: async (): Promise<GetMeResponse> => {
        const response = await api.get<GetMeResponse>('/auth/me');
        return response.data;   
    }
}