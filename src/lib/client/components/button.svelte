<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};
	const { children, class: className }: Props = $props();
</script>

<button
	class={`border-text hover:border-primary hover:text-primary rounded-xl border-2 px-5 py-2 transition-colors ${className ?? ''}`}
>
	{@render children()}
</button>
