<script lang="ts">
  let username = $state("");
  let password = $state("");
  let read = $state(false);

  let error = $state("");
</script>

<h1>Create account</h1>
<form onsubmit={async () => {
  error = "";
  const res = await fetch("/create", {
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
  <div>
    <input type="checkbox" id="read" bind:checked={read}><label for="read">I have read and agree to the <a href="/terms">Terms of Service</a> and the <a href="/privacy">Privacy Policy</a></label>
  </div>
  <input type="submit" value="Create account" class="button" disabled={!read}>
  {#if error.length > 1}
    <div class="error">{error}</div>
  {/if}
</form>
