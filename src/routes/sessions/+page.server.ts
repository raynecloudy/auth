import { authLoad, type Session } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const { cookies, fetch } = event;
  const auth = cookies.get("auth");
  if (!auth) return;
  const account = await authLoad(event);
  const res = await fetch("/whois/sessions", {
    headers: {
      "Token": auth
    }
  });
  const sessions = await res.json() as Session[];
  if (res.ok) return {
    account,
    sessions
  }; else console.log(res);
}
