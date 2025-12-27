<script lang="ts">
  let email = $state("");
  let password = $state("");
  let read = $state(false);
</script>

<h1>Create account</h1>
<form>
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} oninput={() => {
      email = email.replace(/\s/gmi, "");
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
</form>
