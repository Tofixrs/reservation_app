<script lang="ts">
	import type { PageProps } from './$types';
	import { PUBLIC_UPLOADTHING_ID } from '$env/static/public';
	import Calendar from 'svelte-google-materialdesign-icons/Calendar_month.svelte';
	import Button from '$lib/client/components/button.svelte';
	import CropFree from 'svelte-google-materialdesign-icons/Crop_free.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import * as Carouzel from '$lib/client/components/carouzel';

	const { data }: PageProps = $props();
	const descParts = data.room.description.split('\n').filter((v) => v != '\r' && v != '');

	let galleryOpened = $state(false);
	window.addEventListener('keydown', (ev) => {
		if (!galleryOpened) return;

		if (ev.key == 'Escape') galleryOpened = false;
	});
</script>

<div
	class={{
		'absolute top-0 left-0 z-50 grid h-full w-full place-items-center transition-opacity': true,
		'bg-black/50': galleryOpened,
		'pointer-events-none': !galleryOpened,
		'opacity-0': !galleryOpened
	}}
>
	<button
		class="border-text hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-colors"
		onclick={() => (galleryOpened = false)}
	>
		<Close />
	</button>
	<Carouzel.Root class="max-w-1/2">
		{#each data.room.roomImageKeys as key}
			<Carouzel.Item>
				<img src={`https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${key.imageKey}`} alt="" />
			</Carouzel.Item>
		{/each}
	</Carouzel.Root>
</div>
<div class="px-40 max-sm:px-0">
	<div class="grid grid-cols-2 gap-5">
		<div>
			<h1 class="text-center text-4xl">{data.room.name}</h1>
			<div class="flex justify-center py-5">
				<hr class="border-accent w-1/2" />
			</div>
			<div>
				{#each descParts as part}
					<p class="pb-10 text-justify text-xl">
						{part}
					</p>
				{/each}
			</div>
			<div class="flex justify-center">
				<Button class="flex gap-5"><Calendar />Zarezewuj teraz</Button>
			</div>
		</div>
		<div
			class="bg-cover bg-center bg-no-repeat"
			style={`background-image: url(https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${data.room.roomImageKeys[0].imageKey})`}
		></div>
	</div>

	<h1 class="py-5 text-center text-4xl">Gallery</h1>
	<div class="flex justify-center py-5">
		<hr class="border-accent w-1/2" />
	</div>
	<div class="grid grid-cols-4 gap-5">
		{#each data.room.roomImageKeys as key}
			<div
				class="relative grid min-h-64 place-items-center bg-cover bg-center bg-no-repeat"
				style={`background-image: url(https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${key.imageKey})`}
			>
				<button
					class="absolute grid h-full w-full cursor-pointer place-items-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
					onclick={() => (galleryOpened = true)}
				>
					<CropFree />
				</button>
			</div>
		{/each}
	</div>
</div>
