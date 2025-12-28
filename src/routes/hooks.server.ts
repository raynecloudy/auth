import sqlite3 from "sqlite3";
const { Database } = sqlite3;
import { AsyncDatabase } from "promised-sqlite3";

const _db = new Database("./database/database.sqlite3");
export const db = new AsyncDatabase(_db);

db.run(`CREATE TABLE IF NOT EXISTS accounts (
  banReason TEXT,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  joined INTEGER NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  username TEXT NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS sessions (
  code TEXT NOT NULL,
  id INTEGER NOT NULL,
  ip TEXT,
  userAgent TEXT
)`);
