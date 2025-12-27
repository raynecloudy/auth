import { db } from "../hooks.server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Token");
  if (!token) throw error(400, "Missing required header \"Token\"");
  return json(await db.get("SELECT `banReason`, `id`, `joined`, `name`, `username` FROM accounts WHERE authCode = ?", [token]));
};
