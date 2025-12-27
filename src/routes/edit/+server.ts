import { db } from "../hooks.server";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { writeFile } from "node:fs/promises";

// Source - https://stackoverflow.com/a
// Posted by Matthew, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-27, License - CC BY-SA 3.0

function dataURItoBlob(dataURI: string) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { avatarType, avatarStream, name, username } = await request.json();

  const authCode = cookies.get("auth");
  if (!authCode) throw error(401);

  if ((avatarType && !avatarStream) || (!avatarType && avatarStream)) throw error(400, "Some avatar data is missing");

  if (avatarType && typeof avatarType !== "string") throw error(400, "Avatar type is not a string");
  if (avatarStream && typeof avatarStream !== "string") throw error(400, "Avatar stream is not a string");
  if (typeof name !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  if (avatarType && !(avatarType === "image/gif" || avatarType === "image/jpeg" || avatarType === "image/png" || avatarType === "image/webp")) throw error(400, "Avatar has unsupported MIME type");
  if (avatarStream && dataURItoBlob(avatarStream).size > 300000) throw error(400, "Avatar is too large (maximum 300 KB)");

  if (username !== username.replace(/\s/gmi, "")) throw error(400, "Username contains whitespace characters");

  if (name.length > 50) throw error(400, "Name too long (maximum 50 characters)");
  if (username.length < 1) throw error(400, "Username too short (minimum 1 character)");
  if (username.length > 30) throw error(400, "Username too long (maximum 30 characters)");

  if (await db.get("SELECT * FROM accounts WHERE username = ? AND authCode != ?", [username, authCode])) throw error(409, "Username is taken");
  else {
    await db.run("UPDATE accounts SET name = ?, username = ? WHERE authCode = ?", [name, username, authCode]);
    if (avatarType && avatarStream) {
      await writeFile("static/avatars/".concat((await db.get("SELECT `id` FROM accounts WHERE username = ? AND authCode = ?", [username, authCode]) as { id: number }).id.toString()), await dataURItoBlob(avatarStream).bytes(), {
        encoding: "binary"
      });
    }
    return new Response();
  }
};
