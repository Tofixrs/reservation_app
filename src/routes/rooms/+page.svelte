<script lang="ts">
	import type { PageProps } from './$types';
	import { PUBLIC_UPLOADTHING_ID } from '$env/static/public';
	import * as Carouzel from '$lib/client/components/carouzel';

	const props: PageProps = $props();
</script>

<div class="grid grid-cols-2 gap-20 px-40 max-md:grid-cols-1 max-sm:px-0">
	{#each props.data.rooms as room}
		<div class="flex flex-col">
			<Carouzel.Root class="grow">
				{#each room.roomImageKeys as key}
					<Carouzel.Item class="max-h-[500px]">
						<img src={`https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${key.imageKey}`} alt="" />
					</Carouzel.Item>
				{/each}
			</Carouzel.Root>
			<p class="text-center">{room.name}</p>
			<a
				href={`./rooms/${room.id}`}
				class="text-text border-text hover:text-primary hover:border-primary block rounded-md border-2 py-3 text-center no-underline transition-colors"
			>
				Zobacz więcej
			</a>
		</div>
	{/each}
</div>
