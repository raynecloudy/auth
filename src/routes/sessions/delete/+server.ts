import { db } from "../../hooks.server";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) throw error(400, "Missing required header \"Cookie\"");
  const match = cookieHeader.match(/auth=(.*)(;|$)/);
  if (!match) throw error(400, "Missing required cookie \"auth\"");
  const token = match[1];
  await db.run("DELETE FROM sessions WHERE code = ?", [token]);
  return new Response();
};
