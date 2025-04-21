<script lang="ts">
	import type { PageProps } from './$types';
	import { PUBLIC_UPLOADTHING_ID } from '$env/static/public';
	import Calendar from 'svelte-google-materialdesign-icons/Calendar_month.svelte';
	import CropFree from 'svelte-google-materialdesign-icons/Crop_free.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import * as Carouzel from '$lib/client/components/carouzel';

	const { data }: PageProps = $props();
	const descParts = data.room.description.split('\n').filter((v) => v != '\r' && v != '');

	let galleryOpened = $state(false);
	let galleryPage = $state(0);
	$effect.pre(() => {
		window.addEventListener('keydown', (ev) => {
			if (!galleryOpened) return;

			if (ev.key == 'Escape') galleryOpened = false;
		});
	});
</script>

<div
	class={{
		'fixed top-0 left-0 z-50 grid h-dvh place-items-center transition-opacity': true,
		'bg-black/50': galleryOpened,
		'pointer-events-none': !galleryOpened,
		'opacity-0': !galleryOpened
	}}
>
	<button
		class="dark hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 border-white text-white transition-colors"
		onclick={() => (galleryOpened = false)}
	>
		<Close />
	</button>
	<Carouzel.Root
		class="max-h-3/4 max-w-9/10 md:max-w-1/2"
		bind:page={galleryPage}
		autoscroll={false}
	>
		{#each data.room.roomImageKeys as key}
			<Carouzel.Item>
				<img
					src={`https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${key.imageKey}`}
					alt=""
					class="max-h-full"
				/>
			</Carouzel.Item>
		{/each}
	</Carouzel.Root>
</div>
<div class="px-40 max-xl:px-0">
	<div class="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
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
			<div class="flex justify-center max-lg:hidden">
				<a
					class="border-text hover:border-primary hover:text-primary text-text flex gap-5 rounded-xl border-2 px-5 py-2 no-underline transition-colors"
					href={`/reservation?roomType=${data.room.id}`}
				>
					<Calendar />
					<span> Zarezewuj teraz </span>
				</a>
			</div>
		</div>
		<div
			class="bg-cover bg-center bg-no-repeat max-lg:min-h-[400px] max-md:hidden"
			style={`background-image: url(https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${data.room.roomImageKeys[0].imageKey})`}
		></div>
		<div class="flex justify-center lg:hidden">
			<a
				class="border-text hover:border-primary hover:text-primary text-text flex gap-5 rounded-xl border-2 px-5 py-2 no-underline transition-colors"
				href={`/reservation?roomType=${data.room.id}`}
			>
				<Calendar />
				<span> Zarezewuj teraz </span>
			</a>
		</div>
	</div>

	<h1 class="py-5 text-center text-4xl">Gallery</h1>
	<div class="flex justify-center py-5">
		<hr class="border-accent w-1/2" />
	</div>
	<div class="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
		{#each data.room.roomImageKeys as key, i}
			<div
				class="relative grid min-h-64 place-items-center bg-cover bg-center bg-no-repeat"
				style={`background-image: url(https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${key.imageKey})`}
			>
				<button
					class="absolute grid h-full w-full cursor-pointer place-items-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
					onclick={() => {
						galleryPage = i;
						galleryOpened = true;
					}}
				>
					<CropFree />
				</button>
			</div>
		{/each}
	</div>
</div>
