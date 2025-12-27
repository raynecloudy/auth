import cryptoRandomString from "crypto-random-string";
import { db } from "../hooks.server";
import { error, text } from "@sveltejs/kit";
import { hash } from "bcrypt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { password, username } = await request.json();

  if (typeof password !== "string") throw error(400, "Password is not a string");
  if (typeof username !== "string") throw error(400, "Username is not a string");

  const account: any = await db.get("SELECT * FROM accounts WHERE username = ? AND password = ?", [username, await hash(password, 10)]);
  if (account) {
    let authCode = account.authCode;
    if (!account.authCode) {
      authCode = cryptoRandomString({ length: 100 });
      cookies.set("auth", authCode, {
        path: "/"
      });
      await db.run("UPDATE accounts SET authCode = ? WHERE username = ? AND password = ?", [username, password]);
    }
    return text(authCode);
  } else throw error(400, "Incorrect credentials");
};
