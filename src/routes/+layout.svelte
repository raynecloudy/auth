<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/avatar">
  <link rel="stylesheet" href="/style.css">
</svelte:head>

<style>
  sub, sub a {
    color: var(--black4);
  }
</style>

<main>
  {@render children?.()}
</main>
<sub><a href="/">Home</a> • <a href="/privacy">Privacy Statement</a> • <a href="/terms">Terms of Service</a></sub>
