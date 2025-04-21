<script lang="ts">
	import type { Snippet } from 'svelte';
	import { composedGesture, scrollComposition } from 'svelte-gestures';

	let content: HTMLDivElement = $state()!;
	const pageNum = $derived(content?.children.length);
	let totalMovement = $state(0);

	$effect(() => {
		content.scrollTo({
			behavior: 'smooth',
			left: page * content.clientWidth + page * 20
		});
	});

	type Props = {
		children: Snippet;
		class?: string;
		page?: number;
		intervalTime?: number;
		autoscroll?: boolean;
	};
	let {
		children,
		class: className,
		page = $bindable(0),
		intervalTime = 10000,
		autoscroll = true
	}: Props = $props();
	let interval = $state(setInterval(autoChange, intervalTime));

	function autoChange() {
		if (!autoscroll) {
			clearInterval(interval);
			return;
		}
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
	use:composedGesture={(r) => {
		const scrollFns = r(scrollComposition, { delay: 0 });
		return (evs, ev) => {
			if (ev.pointerType == 'mouse') return;
			if (Math.abs(ev.movementX) > Math.abs(ev.movementY)) {
				content.scroll({ left: content.scrollLeft - ev.movementX });
				totalMovement -= ev.movementX;
			} else {
				//@ts-expect-error: sus
				scrollFns.onMove(evs, ev);
			}
		};
	}}
	onpointerup={() => {
		if (Math.abs(totalMovement) > content.clientWidth / 4) {
			if (totalMovement > 0) {
				page++;
				resetInterval();
			} else {
				page--;
				resetInterval();
			}
		} else {
			content.scrollTo({
				behavior: 'smooth',
				left: page * content.clientWidth + page * 20
			});
		}
		totalMovement = 0;
	}}
>
	<div class="absolute flex h-full flex-col justify-center p-5 max-md:hidden">
		{@render navButton('-', () => {
			page > 0 && page--;
			resetInterval();
		})}
	</div>
	<div class="flex grow gap-[20px] overflow-hidden" bind:this={content}>
		{@render children()}
	</div>
	<div class="absolute right-0 flex h-full flex-col justify-center p-5 max-md:hidden">
		{@render navButton('+', () => {
			page < pageNum - 1 && page++;
			resetInterval();
		})}
	</div>
</div>
