import { Database } from "sqlite3";

export const db = new Database("./database/database.sqlite3");

db.run(`CREATE TABLE IF NOT EXISTS accounts (
  banReason TEXT,
  joined INTEGER NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  username TEXT NOT NULL
)`);
