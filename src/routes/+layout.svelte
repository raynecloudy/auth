<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="stylesheet" href="/style.css">
</svelte:head>

<style>
  sub {
    color: var(--black4);
  }
</style>

<main>
  {@render children?.()}
</main>
<sub><a href="/">Home</a> • <a href="/privacy">Privacy Statement</a> • <a href="/terms">Terms of Service</a></sub>
