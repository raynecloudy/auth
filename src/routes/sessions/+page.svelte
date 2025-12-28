<script lang="ts">
  const { data } = $props();
</script>

<h1>Session tracker</h1>
{#if data.account && data.sessions}
  <p>Please remove any sessions you don't recognize.</p>
  {#each data.sessions as session}
    <div class="flex">
      <div style:flex-grow="1">
        <h2 style:margin-top="0">{session.ip}</h2>
        <div>{new Date(session.date).toDateString()}</div>
      </div>
      <button class="button">Remove</button>
    </div>
  {/each}
{:else}
  <p>You need to log in to view this page.</p>
  <a href="/auth" class="button">Log in</a>
{/if}
