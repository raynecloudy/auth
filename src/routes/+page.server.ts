import type { Account } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const auth = cookies.get("auth");
  if (auth) {
    const res = await fetch("/whois", {
      headers: {
        "Token": auth
      }
    });
    if (res.ok) return {
      account: await res.json() as Account
    }; else console.log(res);
  }
  return {
    account: null
  }
};
