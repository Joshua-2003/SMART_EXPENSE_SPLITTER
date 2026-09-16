import { eq, ilike, or, sql } from 'drizzle-orm';

import { db } from '../db/db.js';
import { users, NewUser, User } from '../models/index.js';
import type { UserDirectoryItem } from '../types/auth.js';

export async function findById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1); 
  return user;
}

export async function create(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function listUsers(
  search: string | undefined,
  limit: number,
  offset: number,
): Promise<{ items: UserDirectoryItem[]; total: number }> {
  const where = search
    ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
    : undefined;

  const rows = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(sql`${users.name} ASC`)
    .limit(limit)
    .offset(offset);

  const [totalRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(users)
    .where(where);

  return {
    items: rows,
    total: totalRow?.total ?? 0,
  };
}

export async function update(
  userId: string,
  data: { name?: string; email?: string },
): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return user;
}
