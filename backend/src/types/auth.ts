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
