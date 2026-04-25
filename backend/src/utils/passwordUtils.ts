import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password using bcrypt
 * @param password - Plaintext password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash
 * @param password - Plaintext password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
