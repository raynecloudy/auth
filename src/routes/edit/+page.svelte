<script lang="ts">
  const { data } = $props();

  // svelte-ignore state_referenced_locally
  let name = $state(data.account?.name);
  // svelte-ignore state_referenced_locally
  let username = $state(data.account?.username);

  let error = $state("");
</script>

<h1>Update your profile</h1>
{#if data.account}
  <form onsubmit={async () => {
    error = "";
    const res = await fetch("/edit", {
      method: "POST",
      body: JSON.stringify({
        name,
        username
      })
    });
    if (res.ok) location.href = "/";
    else error = (await res.json()).message;
  }}>
    <div>
      <label for="name">Name</label>
      <input type="text" id="name" bind:value={name}>
      <sub>A name you go by. Can have whitespace.</sub>
    </div>
    <div>
      <label for="username">Username</label>
      <input type="text" id="username" bind:value={username} oninput={() => {
      username = username!.replace(/\s/gmi, "");
    }}>
    </div>
    <div class="action-row">
      <a href="/" class="button">Cancel</a>
      <input type="submit" value="Update profile" class="button">
    </div>
  </form>
  {#if error.length > 1}
    <p class="error">{error}</p>
  {/if}
{:else}
  <p>You need to log in to view this page.</p>
  <a href="/auth" class="button">Log in</a>
{/if}
