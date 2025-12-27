<script lang="ts">
  import type { Account } from "$lib";

  const { data } = $props();

  let account: Account | null = $derived(data.account);
</script>

{#if account}
  <div class="flex">
    <div style:flex-grow="1">
      <h1>Dashboard</h1>
      <p>Logged in as {#if account.name && account.name.length > 0}
        <b>{account.name}</b> (@{account.username})
      {:else}
        <b>@{account.username}</b>
      {/if}</p>
    </div>
    <img src="/avatars/{account.id}" class="avatar" alt={account.name ?? account.username}>
  </div>
  <p><sub>Joined {new Date(account.joined).toDateString()}</sub></p>
  <a href="/edit" class="button">Edit profile</a>
{:else}
  <h1>auth.rayne.page</h1>
  <h2>What is this?</h2>
  <p>This service handles and centralizes authentication across projects I own. It gives you a persistent identifier usable throughout my ecosystem.</p>
  <div class="action-row">
    <a href="/create" class="button">Create account</a>
    <a href="/auth" class="button">Log in</a>
  </div>
{/if}
