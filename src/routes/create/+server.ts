import cryptoRandomString from "crypto-random-string";
import { db } from "../hooks.server";
import { error } from "@sveltejs/kit";
import { hash } from "bcrypt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, getClientAddress, request }) => {
  const { password, username } = await request.json();

  if (typeof password !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  if (username !== username.replace(/\s/gmi, "")) throw error(400, "Username contains whitespace characters");

  if (username.length < 1) throw error(400, "Username too short (minimum 1 character)");
  if (username.length > 30) throw error(400, "Username too long (maximum 30 characters)");
  if (password.length < 8) throw error(400, "Password too short (minimum 8 characters)");
  if (password.length > 60) throw error(400, "Password too long (maximum 60 characters)");

  if (await db.get("SELECT * FROM accounts WHERE username = ?", [username])) throw error(409, "Username is taken");
  else {
    const authCode = cryptoRandomString({ length: 100 });
    cookies.set("auth", authCode, {
      path: "/"
    });
    const passwordHash = await hash(password, 10);
    await db.run("INSERT INTO accounts (joined, password, username) VALUES (?, ?, ?)", [Date.now(), passwordHash, username]);
    await db.run("INSERT INTO sessions (code, date, id, ip, userAgent) VALUES (?, ?, ?, ?, ?)", [authCode, Date.now(), (await db.get("SELECT `id` FROM accounts WHERE username = ? AND password = ?", [username, passwordHash]) as { id: number }).id, getClientAddress(), request.headers.get("User-Agent")]);
    return new Response();
  }
};
