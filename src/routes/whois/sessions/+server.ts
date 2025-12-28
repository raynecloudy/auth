import type { Account } from "$lib";
import { db } from "../../hooks.server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Token");
  if (!token) throw error(400, "Missing required header \"Token\"");
  const session = await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number };
  if (!session) throw error(404);
  const sessions = await db.all("SELECT `date`, `ip`, `userAgent` FROM sessions WHERE id = ?", [session.id]);
  if (sessions.length === 0) throw error(404);
  return json(sessions);
};
