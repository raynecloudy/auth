import type { ServerLoadEvent } from "@sveltejs/kit";

export type Account = {
  banReason: string,
  id: number,
  joined: number,
  name: string,
  username: string
};

export const authLoad: (event: ServerLoadEvent) => Promise<{ account: Account | null }> = async ({ cookies, fetch }) => {
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
