<script lang="ts">
  let username = $state("");
  let password = $state("");

  let error = $state("");
</script>

<h1>Log in</h1>
<form onsubmit={async () => {
  error = "";
  const res = await fetch("/auth", {
    method: "POST",
    body: JSON.stringify({
      password,
      username
    })
  });
  if (res.ok) location.href = "/";
  else error = (await res.json()).message;
}}>
  <div>
    <label for="username">Username</label>
    <input type="text" id="username" bind:value={username} oninput={() => {
      username = username.replace(/\s/gmi, "");
    }} required>
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required>
  </div>
  <input type="submit" value="Log in" class="button pink">
  {#if error.length > 1}
    <div class="error">{error}</div>
  {/if}
</form>
