<script lang="ts">
  import type { Account } from "$lib";

  const { data } = $props();

  let account: Account | null = $derived(data.account);
</script>

{#if account}
  <div class="profile">
    <img src="/avatars/{account.id}" class="avatar" alt={account.name ?? account.username}>
    <div>
      <h2>{account.name ?? account.username}</h2>
      <div>@{account.username}</div>
      <div><sub>Joined {new Date(account.joined).toDateString()}</sub></div>
    </div>
  </div>
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
