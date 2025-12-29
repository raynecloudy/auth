<script lang="ts">
  const { data } = $props();

  let avatar: FileList | undefined = $state();
  // svelte-ignore state_referenced_locally
  let name = $state(data.account?.name);
  // svelte-ignore state_referenced_locally
  let username = $state(data.account?.username);

  let error = $state("");

  // svelte-ignore state_referenced_locally
  let avatarDataURL = $state("/avatar");

  $effect(() => {
    (async () => {
      const avatarData = avatar?.item(0);
      if (avatarData) avatarDataURL = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString() ?? "/avatar");
        reader.readAsDataURL(avatarData);
      });
    })();
  });
</script>

<svelte:head>
  <title>Edit profile – RAuth</title>
</svelte:head>

<h1>Update your profile</h1>
{#if data.account}
  <form onsubmit={async () => {
    error = "";
    const avatarData = avatar?.item(0);
    const res = await fetch("/edit", {
      method: "POST",
      body: JSON.stringify({
        avatarType: avatarData ? avatarData.type : null,
        avatarStream: avatarData ? await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(avatarData);
        }) : null,
        name,
        username
      })
    });
    if (res.ok) location.href = "/";
    else error = (await res.json()).message;
  }}>
  <div class="flex">
    <div>
      <label for="avatar">Avatar</label>
      <input type="file" id="avatar" accept="image/avif, image/gif, image/jpeg, image/png, image/webp" bind:files={avatar}>
      <sub>Supported types: AVIF, GIF, JPEG, PNG, WEBP, maximum 300 KB</sub>
    </div>
    <img src="/avatar" class="avatar" alt={data.account.name ?? data.account.username}>
  </div>
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
      <input type="submit" value="Update profile" class="button pink">
    </div>
  </form>
  {#if error.length > 1}
    <p class="error">{error}</p>
  {/if}
{:else}
  <p>You need to log in to view this page.</p>
  <a href="/auth" class="button">Log in</a>
{/if}
