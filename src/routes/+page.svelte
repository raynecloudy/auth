<script lang="ts">
  const { data } = $props();
</script>

<svelte:head>
  {#if data.account && data.account.name}
    <title>{data.account.name} (@{data.account.username})</title>
  {:else if data.account}
    <title>@{data.account.username}</title>
  {:else}
    <title>RAuth</title>
  {/if}
</svelte:head>

{#if data.account}
  <div class="profile">
    <img src="/avatar" class="avatar" alt={data.account.name ?? data.account.username}>
    <div>
      <h2>{data.account.name ?? data.account.username}</h2>
      <div>@{data.account.username}</div>
      <div><sub>Joined {new Date(data.account.joined).toDateString()}</sub></div>
    </div>
  </div>
  <div class="action-row">
    <a href="/edit" class="button">Edit profile</a>
    <a href="/sessions" class="button">Session tracker</a>
  </div>
{:else}
  <h1>RAuth</h1>
  <h2>What is this?</h2>
  <p>This service handles and centralizes authentication across projects I own. It gives you a persistent identifier usable throughout my ecosystem.</p>
  <div class="action-row">
    <a href="/create" class="button indigo">Create account</a>
    <a href="/auth" class="button pink">Log in</a>
  </div>
{/if}
