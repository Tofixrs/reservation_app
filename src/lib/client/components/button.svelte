<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
		onclick?: (ev: MouseEvent) => void;
		type?: 'reset' | 'submit' | 'button';
		disabled?: boolean;
	};
	const { children, class: className, onclick, type, disabled }: Props = $props();
</script>

<button
	class={`border-text hover:border-primary hover:text-primary disabled:border-text disabled:text-text rounded-xl border-2 px-5 py-2 transition-colors disabled:cursor-not-allowed disabled:bg-gray-700 ${className ?? ''}`}
	{type}
	{onclick}
	{disabled}
>
	{@render children()}
</button>
