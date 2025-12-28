import type { Account, Session } from "$lib";
import { db } from "../../hooks.server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Token");
  if (!token) throw error(400, "Missing required header \"Token\"");
  const session = await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number };
  if (!session) throw error(404);
  const sessions = await db.all("SELECT `code`, `date`, `ip`, `userAgent` FROM sessions WHERE id = ?", [session.id]) as Session[];
  if (sessions.length === 0) throw error(404);
  for (const session of sessions) {
    session.isCurrent = token === session.code;
    session.code = undefined;
  }
  return json(sessions);
};
