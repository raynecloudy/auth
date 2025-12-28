<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/style.css">
</svelte:head>

<main>
	{@render children?.()}
</main>
<sub style:opacity="0.6"><a href="/">Home</a> • <a href="/privacy">Privacy Statement</a> • <a href="/terms">Terms of Service</a></sub>
