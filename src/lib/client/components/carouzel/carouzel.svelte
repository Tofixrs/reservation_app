<script lang="ts">
	import type { Snippet } from 'svelte';
	import { swipe } from 'svelte-gestures';

	const intervalTime = 10000;

	let page = $state(0);
	let content: HTMLDivElement = $state()!;
	let interval = $state(setInterval(autoChange, intervalTime));
	const pageNum = $derived(content?.children.length);

	$effect(() => {
		content.scrollTo({
			behavior: 'smooth',
			left: page * content.clientWidth
		});
	});

	type Props = {
		children: Snippet;
		class?: string;
	};
	const { children, class: className }: Props = $props();

	function autoChange() {
		if (page == pageNum - 1) return (page = 0);
		page++;
	}

	function resetInterval() {
		clearInterval(interval);
		interval = setInterval(autoChange, intervalTime);
	}
</script>

{#snippet navButton(text: string, onclick: () => any)}
	<button
		{onclick}
		class="hover:border-text/50 hover:bg-background/50 inline-block h-10 w-10 rounded-full border-2 border-solid border-transparent transition-colors"
	>
		{text}
	</button>
{/snippet}

<div
	class={`relative flex ${className ?? ''}`}
	use:swipe={() => ({ timeframe: 300, minSwipeDistance: 10, touchAction: 'pan-y' })}
	onswipe={(e) => {
		if (e.detail.direction == 'right') page > 0 && page--;
		if (e.detail.direction == 'left') page < pageNum && page++;

		resetInterval();
	}}
>
	<div class="absolute flex h-full flex-col justify-center p-5 max-md:hidden">
		{@render navButton('-', () => {
			page > 0 && page--;
			resetInterval();
		})}
	</div>
	<div class="flex grow overflow-hidden" bind:this={content}>
		{@render children()}
	</div>
	<div class="absolute right-0 flex h-full flex-col justify-center p-5 max-md:hidden">
		{@render navButton('+', () => {
			page < pageNum - 1 && page++;
			resetInterval();
		})}
	</div>
</div>
