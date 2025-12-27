import cryptoRandomString from "crypto-random-string";
import { db } from "../hooks.server";
import { error } from "@sveltejs/kit";
import { hash } from "bcrypt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const { password, username } = await request.json();

  if (typeof password !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  if (username !== username.replace(/\s/gmi, "")) throw error(400, "Username contains whitespace characters");

  if (username.length < 1) throw error(400, "Username too short (minimum 1 character)");
  if (username.length > 30) throw error(400, "Username too long (maximum 30 characters)");
  if (password.length < 8) throw error(400, "Password too short (minimum 8 characters)");
  if (password.length > 60) throw error(400, "Password too long (maximum 60 characters)");

  if (await db.get("SELECT * FROM accounts WHERE username = ?", [username])) throw error(400, "Username is taken");
  else {
    const authCode = cryptoRandomString({ length: 100 });
    await db.run("INSERT INTO accounts (authCode, joined, password, username) VALUES (?, ?, ?, ?)", [authCode, Date.now(), await hash(password, 10), username]);
    return new Response(authCode);
  }
};
