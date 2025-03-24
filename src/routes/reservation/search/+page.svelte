<script lang="ts">
	import { PUBLIC_UPLOADTHING_ID } from '$env/static/public';
	import Button from '$lib/client/components/button.svelte';
	import type { PageProps } from './$types';
	import type { RoomWithInfo } from '$lib/server/db/schema';
	import { locale } from 'svelte-i18n';

	const { data }: PageProps = $props();
	const diff = data.until.getTime() - data.from.getTime();
	const days = diff / 86400000 + 1;
	const peopleNeeded = data.roomSizes.reduce((a, b) => a + b);
	let roomsAdded: RoomWithInfo[] = $state([]);
	const peopleAdded = $derived(roomsAdded.reduce((acc, v) => acc + v.roomTypes.size, 0));

	function addRoom(room: RoomWithInfo) {
		const idx = roomsAdded.findIndex((v) => v.id == room.id);
		if (idx != -1) {
			roomsAdded.splice(idx, 1);
			return;
		}
		if (peopleAdded >= peopleNeeded) return;

		roomsAdded.push(room);
	}
</script>

{#if data.notEnoughRoomsOfSize}
	<h1 class="text-center text-4xl">
		<span>No availble rooms of the sizes provided</span>
		<a href="/reservation">Go back</a>
	</h1>
{:else if data.search.length != 0}
	<div class="bg-background sticky top-0 flex justify-center gap-5 p-5">
		<div class="bg-secondary grid min-w-36 grid-rows-2 rounded-sm px-2 py-1">
			<p>
				{data.from.toLocaleDateString($locale ?? 'en-US', { weekday: 'short' })}
				{data.from.getDate()}
				{data.from.toLocaleDateString($locale ?? 'en-US', { month: 'short' })}
			</p>
			<p class="text-xs">{data.from.getFullYear()}</p>
		</div>
		<div class="bg-secondary grid min-w-36 grid-rows-2 rounded-sm px-2 py-1">
			<p>
				{data.until.toLocaleDateString($locale ?? 'en-US', { weekday: 'short' })}
				{data.until.getDate()}
				{data.until.toLocaleDateString($locale ?? 'en-US', { month: 'short' })}
			</p>
			<p class="text-xs">{data.until.getFullYear()}</p>
		</div>
		<div class="bg-secondary grid min-w-36 place-items-center rounded-sm px-2 py-1">
			{days} days
		</div>
		<div class="bg-secondary grid min-w-36 grid-rows-2 rounded-sm px-2 py-1">
			<p>
				{`${data.roomSizes.reduce((a, b) => a + b)} people`}
			</p>
			<p class="text-xs">{`${data.roomSizes.length} room(s)`}</p>
		</div>
	</div>
	<div class="flex flex-col gap-10 px-40">
		{#each data.search as room}
			<div class="bg-secondary flex gap-10 rounded-sm">
				<div
					class="grow rounded-l-sm bg-cover bg-center bg-no-repeat"
					style={`background-image: url(https://${PUBLIC_UPLOADTHING_ID}.ufs.sh/f/${room.roomTypes.roomImageKeys[0].imageKey})`}
				></div>
				<div class="flex grow-2 flex-col gap-10 p-5">
					<h1 class="text-4xl">{room.roomTypes.name}</h1>
					<div class="flex justify-between">
						<p>Room for {room.roomTypes.size}</p>
						<div>
							<p>From {room.roomTypes.pricePerDay * days}zł</p>
						</div>
					</div>
					<Button onclick={() => addRoom(room)}
						>{roomsAdded.find((v) => v.id == room.id) ? 'Added' : 'Book'}</Button
					>
				</div>
			</div>
		{/each}
	</div>
	{#if roomsAdded.length > 0}
		<div class="bg-background sticky bottom-0 flex justify-between px-40 py-5">
			<div>
				<p>From</p>
				<p>{roomsAdded.reduce((acc, v) => acc + v.roomTypes.pricePerDay, 0) * days}zł</p>
			</div>
			<form action="/reservation/reserve" method="GET">
				<div><Button disabled={peopleNeeded > peopleAdded}>Next</Button></div>
				<input
					type="hidden"
					value={JSON.stringify(roomsAdded.map((v) => v.id))}
					name="rooms"
					required
				/>
				<input type="hidden" name="from" value={data.from} />
				<input type="hidden" name="until" value={data.until} />
				<div class:text-red-500={peopleNeeded > peopleAdded}>
					Enough size: {peopleAdded}/{peopleNeeded}
				</div>
			</form>
		</div>
	{/if}
{:else}
	<h1 class="text-center text-4xl">
		<span>No availble rooms</span>
		<a href="/reservation">Go back</a>
	</h1>
{/if}
