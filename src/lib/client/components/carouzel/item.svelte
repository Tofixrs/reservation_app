<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};
	const { children, class: className }: Props = $props();
</script>

<div class={`flex min-w-full justify-center align-middle ${className ?? ''}`}>
	<div class="grid content-center">
		{@render children()}
	</div>
</div>
