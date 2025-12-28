import type { Account } from "$lib";
import { db } from "../hooks.server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) throw error(400, "Missing required header \"Cookie\"");
  const match = cookieHeader.match(/auth=(.*)(;|$)/);
  if (!match) throw error(400, "Missing required cookie \"auth\"");
  const token = match[1];
  const session = await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number };
  if (!session) throw error(404);
  const account = await db.get("SELECT `banReason`, `id`, `joined`, `name`, `username` FROM accounts WHERE id = ?", [session.id]) as Account;
  if (!account) throw error(404);
  return json(account);
};
