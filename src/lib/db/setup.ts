import { drizzle } from 'drizzle-orm/d1';

let db: ReturnType<typeof drizzle>;

export function initDatabase(d1Database: D1Database) {
  if (db) {
    return db;
  }
  db = drizzle(d1Database);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
