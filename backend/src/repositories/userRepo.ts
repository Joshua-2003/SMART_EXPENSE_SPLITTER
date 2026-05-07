import { db } from '@/db/db.js';
import { users } from '@/models/schema.js';
import { eq } from 'drizzle-orm';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new user in the database
 * @param input - User data (email, passwordHash, name)
 * @returns Created user record
 */
export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
    })
    .returning();

  return user as UserRecord;
}

/**
 * Find user by email
 * @param email - User email address
 * @returns User record or null if not found
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return (user as UserRecord) || null;
}

/**
 * Find user by ID
 * @param userId - User UUID
 * @returns User record or null if not found
 */
export async function findUserById(userId: string): Promise<UserRecord | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  return (user as UserRecord) || null;
}
