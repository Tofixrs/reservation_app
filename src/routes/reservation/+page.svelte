<script lang="ts">
	import Button from '$lib/client/components/button.svelte';
	import Input from '$lib/client/components/input.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let rooms: number[] = $state([]);
	let peopleNum = $state(data.selectedRoomType ? data.maxRoomSize?.toString() : '');
	let from = $state('');
	let until = $state('');
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
</script>

<h1 class="text-center text-4xl">Reservation</h1>
<form
	action="/reservation/search"
	method="get"
	class="flex flex-col gap-5"
	onsubmit={(ev) => {
		if (rooms.length == 0) ev.preventDefault();
	}}
>
	<label for="from">Arrival: </label>
	<Input
		type="date"
		name="from"
		id="from"
		bind:value={from}
		min={tomorrow.toLocaleDateString('fr-ca')}
	/>
	<label for="until">Leave: </label>
	<Input
		type="date"
		name="until"
		id="until"
		bind:value={until}
		min={from || tomorrow.toLocaleDateString('fr-ca')}
	/>
	<label for="maxPrice">Max Price:</label>
	<Input type="number" name="maxPrice" id="amount" min={0} required={false} />

	<div class="flex items-center">
		<label for="peopleNum">Amount of people:</label>
		<Input
			type="number"
			id="peopleNum"
			name="peopleNum"
			bind:value={peopleNum}
			max={data.maxRoomSize}
			min={data.selectedRoomType ? data.maxRoomSize : 0}
			disabled={data.selectedRoomType}
			required={false}
		/>
		<Button
			type="button"
			onclick={() => {
				if (peopleNum == '') return;
				let peopleNumI = Number(peopleNum);
				if (isNaN(peopleNumI)) return;
				if (peopleNumI > 4) return;
				rooms.push(peopleNumI);
			}}>Add room</Button
		>
	</div>
	<div>
		{#each rooms as room, i}
			<div class="flex">
				<p class="grow">Room for {room}</p>
				<Button
					type="button"
					onclick={() => {
						rooms = rooms.toSpliced(i, 1);
					}}><Close /></Button
				>
			</div>
		{/each}
	</div>
	<input type="hidden" value={JSON.stringify(rooms)} name="rooms" />
	<input type="hidden" name="roomType" value={data.roomType} />

	<Button>Search</Button>
</form>
