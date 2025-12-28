<script lang="ts">
  import { UAParser, type IResult } from "ua-parser-js";

  const { data } = $props();

  let userAgent: IResult[] = $state([]);

  userAgent = [];
  // svelte-ignore state_referenced_locally
  if (data.sessions) for (const session of data.sessions) {
    userAgent.push(new UAParser(session.userAgent).getResult());
  }
</script>

<h1>Session tracker</h1>
{#if data.account && data.sessions}
<p>Please remove any sessions you don't recognize.</p>
{#each data.sessions as session, i}
    <div class="flex">
      <div style:flex-grow="1">
        <h2 style:margin-top="0" title={session.userAgent}>{userAgent[i].browser.toString()} {userAgent[i].os.toString()}</h2>
        <sub><code>{session.ip}</code> • {new Date(session.date).toDateString()}{#if session.isCurrent}<br>Current session{/if}</sub>
      </div>
      <button class="button" onclick={async () => {
        const res = await fetch("/sessions/delete", {
          method: "POST"
        });
        if (!res.ok) return;
      }}>Remove</button>
    </div>
    <a href="/" class="button">Return</a>
  {/each}
{:else}
  <p>You need to log in to view this page.</p>
  <a href="/auth" class="button">Log in</a>
{/if}
