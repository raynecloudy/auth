import { db } from "../hooks.server";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { name, username } = await request.json();

  const authCode = cookies.get("auth");
  if (!authCode) throw error(401);

  if (typeof name !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  if (username !== username.replace(/\s/gmi, "")) throw error(400, "Username contains whitespace characters");

  if (name.length > 50) throw error(400, "Name too long (maximum 50 characters)");
  if (username.length < 1) throw error(400, "Username too short (minimum 1 character)");
  if (username.length > 30) throw error(400, "Username too long (maximum 30 characters)");

  if (await db.get("SELECT * FROM accounts WHERE username = ? AND authCode != ?", [username, authCode])) throw error(400, "Username is taken");
  else {
    await db.run("UPDATE accounts SET name = ?, username = ? WHERE authCode = ?", [name, username, authCode]);
    return new Response();
  }
};
