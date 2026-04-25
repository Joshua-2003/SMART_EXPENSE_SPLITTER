import * as authRepository from '@/repositories/authRepository.js';
import { hashPassword, verifyPassword } from '@/utils/passwordUtils.js';
import { generateToken } from '@/utils/jwtUtils.js';
import { ConflictError, AuthenticationError } from '@/utils/errorUtils.js';

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user : {
    userId: string;
    email: string;
    name: string;
  }
  token: string;
  expiresIn: number;
  createdAt?: Date;
}

/**
 * Register a new user (signup)
 * 
 * @param input - Signup credentials (email, password, name)
 * @returns User data with JWT token
 * @throws ConflictError if email already exists
 */
export async function signup(input: SignupInput): Promise<AuthResponse> {
  // Check if email already exists
  const existingUser = await authRepository.findUserByEmail(input.email);
  if (existingUser) {
    throw new ConflictError('This email is already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user in database
  const user = await authRepository.createUser({
    email: input.email,
    passwordHash,
    name: input.name,
  });

  // Generate JWT token
  const token = generateToken(user.id);


  return {
    user: {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    token,
    expiresIn: 86400, // 24 hours in seconds
  };
}

/**
 * Authenticate user (login)
 * 
 * @param input - Login credentials (email, password) - pre-validated
 * @returns User data with JWT token
 * @throws AuthenticationError if invalid credentials
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  // Find user by email
  const user = await authRepository.findUserByEmail(input.email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const passwordValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken(user.id);

  return {
    user: {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    token,
    expiresIn: 86400, // 24 hours in seconds
  };
}

/**
 * Get user by ID (used for profile retrieval)
 * @param userId - User UUID
 * @returns User data without password
 * @throws NotFoundError if user not found
 */
export async function getUserProfile(userId: string) {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Return user without password hash
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
