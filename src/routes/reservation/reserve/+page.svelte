<script lang="ts">
	import ArrowRight from 'svelte-google-materialdesign-icons/Arrow_right.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
	import { locale } from 'svelte-i18n';
	import Input from '$lib/client/components/input.svelte';
	import Button from '$lib/client/components/button.svelte';

	let people = $state(data.rooms.reduce((acc, v) => acc + v.roomTypes.size, 0).toString());
	const peopleNum = $derived(Number(people));
	const diff = data.until.getTime() - data.from.getTime();
	const days = diff / 86400000 + 1;
	let additions = $state({
		food: false
	});

	const price = $derived(
		20 * Number(additions.food) * peopleNum * days +
			data.rooms.reduce((acc, v) => acc + v.roomTypes.pricePerDay * days, 0)
	);
</script>

<div class="grid grid-cols-[3fr_1fr] px-50">
	<div class="px-20">
		<h1 class="text-3xl">Dodatki</h1>
		<div>
			<div
				class="bg-primary flex justify-between rounded-t-md px-5 py-2 text-white dark:text-black"
			>
				<h2 class="text-xl">Jedzenie</h2>
				<p class="text-xl">20zł/os/dzien</p>
			</div>
			<div class="bg-foreground flex items-center justify-end gap-5 rounded-b-md px-5 py-5">
				<p>{20 * peopleNum * days}zł</p>
				<Button onclick={() => (additions.food = !additions.food)}
					>{additions.food ? 'Dodano' : 'Dodaj'}</Button
				>
			</div>
		</div>
	</div>
	<div class="rounded-md">
		<h1 class="bg-primary rounded-t-md p-5 text-white dark:text-black">Podsumowanie rezerwacji</h1>
		<div class="bg-foreground grid grid-cols-1 gap-5 rounded-b-md px-5 py-5">
			<div class="grid grid-cols-3">
				<div>
					<p>
						{data.from.toLocaleDateString($locale ?? 'en-US', { weekday: 'short' })}
						{data.from.getDate()}
						{data.from.toLocaleDateString($locale ?? 'en-US', { month: 'short' })}
					</p>
					<p>From 14:00</p>
				</div>
				<div class="grid place-items-center">
					<ArrowRight />
				</div>
				<div>
					<p>
						{data.until.toLocaleDateString($locale ?? 'en-US', { weekday: 'short' })}
						{data.until.getDate()}
						{data.until.toLocaleDateString($locale ?? 'en-US', { month: 'short' })}
					</p>
					<p>To 12:00</p>
				</div>
			</div>
			<div>
				{#each data.rooms as room}
					<p class="text-sm">{room.roomTypes.name}</p>
					<p class="text-xs">{room.roomTypes.size} people</p>
				{/each}
			</div>
			<div>
				<label for="people">People</label>
				<Input name="people" bind:value={people} type="number" id="people" min={1} />
			</div>
			<p class="text-right">
				Cena ostateczna: {price}zł
			</p>
			<div class="flex justify-end">
				<form action="/reservation/finish">
					<input
						type="hidden"
						name="rooms"
						value={JSON.stringify(data.rooms.reduce((acc, v) => [...acc, v.id], [] as number[]))}
					/>
					<input type="hidden" name="additions" value={JSON.stringify(additions)} />
					<input type="hidden" name="from" value={data.from.getTime()} />
					<input type="hidden" name="until" value={data.until.getTime()} />
					<input type="hidden" name="people" value={people} />
					<Button>Rezerwuj</Button>
				</form>
			</div>
		</div>
	</div>
</div>
