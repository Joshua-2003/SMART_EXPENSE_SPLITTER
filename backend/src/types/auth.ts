export interface JwtPayload {
  userId: string;
  email: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface SignupResult {
  userId: string;
  email: string;
  name: string;
  token: string;
  createdAt: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  userId: string;
  email: string;
  name: string;
  token: string;
  expiresIn: number;
}

export interface ProfileResult {
  userId: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export interface UpdateProfileResult {
  userId: string;
  email: string;
  name: string;
  updatedAt: Date;
}
