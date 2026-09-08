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
