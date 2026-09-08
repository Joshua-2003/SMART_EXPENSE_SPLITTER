import bcrypt from 'bcrypt';

import { create, findByEmail } from '../repositories/user.repository.js';
import type { LoginInput, LoginResult, SignupInput, SignupResult } from '../types/auth.js';
import { signAccessToken, TOKEN_EXPIRES_IN_SECONDS } from '../utils/jwt.js';
import { HttpError } from '../utils/http-error.js';

const BCRYPT_ROUNDS = 10;

export async function signup(input: SignupInput): Promise<SignupResult> {
  const email = input.email.trim().toLowerCase();

  const existing = await findByEmail(email);
  if (existing) {
    throw new HttpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await create({
    email,
    passwordHash,
    name: input.name.trim(),
  });

  const token = signAccessToken({ userId: user.id, email: user.email });

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    token,
    createdAt: user.createdAt,
  };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();

  const user = await findByEmail(email);
  if (!user) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = signAccessToken({ userId: user.id, email: user.email });

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    token,
    expiresIn: TOKEN_EXPIRES_IN_SECONDS,
  };
}
