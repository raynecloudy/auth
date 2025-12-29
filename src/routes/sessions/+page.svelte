<script lang="ts">
  import { UAParser, type IResult } from "ua-parser-js";

  const { data } = $props();

  let userAgent: IResult[] = $state([]);
  // svelte-ignore state_referenced_locally
  let sessions = $state(data.sessions);

  if (sessions) for (const session of sessions) {
    userAgent.push(new UAParser(session.userAgent).getResult());
  }
</script>

<svelte:head>
  <title>Session tracker – RAuth</title>
</svelte:head>

<h1>Session tracker</h1>
{#if data.account && sessions}
<p>Please remove any sessions you don't recognize.</p>
{#each sessions as session, i}
    <div class="flex" id="session-list">
      <div style:flex-grow="1">
        <h2 style:margin-top="0" title={session.userAgent}>{userAgent[i].browser.toString()} {userAgent[i].os.toString()}</h2>
        <sub><code>{session.ip}</code> • {new Date(session.date).toDateString()}{#if session.isCurrent}<br>Current session{/if}</sub>
      </div>
      <button class="orange" onclick={async () => {
        const res = await fetch("/sessions/delete", {
          method: "POST",
          body: JSON.stringify({
            code: session.code
          })
        });
        if (!res.ok) return;
        if (session.isCurrent) location.href = "/";
        else {
          userAgent.splice(i, 1);
          sessions.splice(i, 1);
        }
      }}>Remove</button>
    </div>
  {/each}
  <div class="action-row">
    <a href="/" class="button">Return</a>
      <button class="red" onclick={async () => {
        const res = await fetch("/sessions/delete/all", {
          method: "POST"
        });
        if (!res.ok) return;
        location.href = "/";
      }}>Remove all</button>
  </div>
{:else}
  <p>You need to log in to view this page.</p>
  <a href="/auth" class="button">Log in</a>
{/if}
