import { db } from "../../hooks.server";
import { error } from "@sveltejs/kit";
import { existsSync } from "node:fs";
import mime from "mime";
const { getType } = mime;
import { readFile } from "node:fs/promises";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, request }) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) throw error(400, "Missing required header \"Cookie\"");
  const match = cookieHeader.match(/auth=(.*)(;|$)/);
  if (!match) throw error(400, "Missing required cookie \"auth\"");
  const token = match[1];
  const id = (await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number }).id;
  if (!id) throw error(401);
  if (id.toString() !== params.id) throw error(403);
  let path = "./database/avatars/".concat(params.id);
  let exists = existsSync(path);
  if (!exists) path = "static/avatars/default.jpg";
  const data = await readFile(path);
  return new Response(data, {
    headers: {
      "Content-Type": exists ? getType(path)! : "image/jpeg"
    }
  });
};
