import { db } from "..//hooks.server";
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
  const id = (await db.get("SELECT `id` FROM sessions WHERE code = ?", [token]) as { id: number })?.id;
  let path = "./database/avatars/".concat(id?.toString());
  let exists = existsSync(path);
  if (!exists) path = "static/avatars/default.jpg";
  const data = await readFile(path);
  return new Response(data, {
    headers: {
      "Content-Type": exists ? getType(path)! : "image/jpeg"
    }
  });
};
