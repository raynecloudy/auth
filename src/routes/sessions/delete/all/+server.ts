import { db } from "../../../hooks.server";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) throw error(400, "Missing required header \"Cookie\"");
  const match = cookieHeader.match(/auth=(.*)(;|$)/);
  if (!match) throw error(400, "Missing required cookie \"auth\"");
  const token = match[1];
  const accountId = (await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number }).id;
  await db.run("DELETE FROM sessions WHERE id = ?", [accountId]);
  return new Response();
};
