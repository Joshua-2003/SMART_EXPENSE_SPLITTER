/**
 * User & Authentication Types
 * Based on DatabaseSchema.sql (users table) & API_CONTRACT.json (/auth/*, /users/*)
 */

export interface User {
  id: string; // UUID
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  token: string;
  expiresIn?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}
