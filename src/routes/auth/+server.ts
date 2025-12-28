import cryptoRandomString from "crypto-random-string";
import { db } from "../hooks.server";
import { error, text } from "@sveltejs/kit";
import { compare } from "bcrypt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, getClientAddress, request }) => {
  const { password, username } = await request.json();

  if (typeof password !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  const account: any = await db.get("SELECT * FROM accounts WHERE username = ?", [username]);
  if (account && await compare(password, account.password)) {
    const authCode = cryptoRandomString({ length: 100 });
    cookies.set("auth", authCode, {
      path: "/",
      maxAge: 3.456e10,
      secure: true
    });
    await db.run("INSERT INTO sessions (code, date, id, ip, userAgent) VALUES (?, ?, ?, ?, ?)", [authCode, Date.now(), (await db.get("SELECT `id` FROM accounts WHERE username = ?", [username]) as { id: number }).id, getClientAddress(), request.headers.get("User-Agent")]);
    return text(authCode);
  } else throw error(400, "Incorrect credentials");
};
