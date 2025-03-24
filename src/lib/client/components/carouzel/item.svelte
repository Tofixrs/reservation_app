<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};
	const { children, class: className }: Props = $props();
</script>

<div class={`grid max-h-svh w-full min-w-full place-items-center ${className ?? ''}`}>
	{@render children()}
</div>
