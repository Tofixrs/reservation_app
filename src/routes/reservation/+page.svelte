<script lang="ts">
	import Button from '$lib/client/components/button.svelte';
	import Input from '$lib/client/components/input.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import type { PageProps } from './$types';
	import { pan, swipe, composedGesture, scrollComposition } from 'svelte-gestures';

	const { data }: PageProps = $props();
	let rooms: number[] = $state([]);
	let peopleNum = $state(data.selectedRoomType ? data.maxRoomSize?.toString() : '');
	let from = $state('');
	let until = $state('');
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	let dropDownOpen = $state(false);
	let dropDownRef: HTMLDivElement;
	let shouldHideDropdown = false;
</script>

<h1 class="text-center text-4xl">Reservation</h1>
<form
	action="/reservation/search"
	method="get"
	class="flex grow flex-col items-center justify-center gap-5"
	onsubmit={(ev) => {
		if (rooms.length == 0) ev.preventDefault();
	}}
>
	<div></div>
	<div class="flex flex-wrap items-stretch justify-center gap-10">
		<div class="bg-foreground flex flex-col rounded-xl px-5 py-2">
			<label for="from" class="text-center">Arrival</label>
			<Input
				type="date"
				name="from"
				id="from"
				bind:value={from}
				min={tomorrow.toLocaleDateString('fr-ca')}
			/>
		</div>
		<div class="bg-foreground flex flex-col rounded-xl px-5 py-2">
			<label for="until" class="text-center">Leave</label>
			<Input
				type="date"
				name="until"
				id="until"
				bind:value={until}
				min={from || tomorrow.toLocaleDateString('fr-ca')}
			/>
		</div>

		<div class="max-md:relative">
			<button
				class="bg-foreground relative flex min-h-[100%] flex-col justify-evenly rounded-xl px-5 py-2"
				type="button"
				onclick={() => {
					dropDownOpen = !dropDownOpen;
					dropDownRef.style.top = '0px';
				}}
			>
				<div>
					<p>Rooms: {rooms.length}</p>
					<p>People: {rooms.reduce((a, b) => a + b, 0)}</p>
				</div>
			</button>
			<div
				class="max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:flex max-lg:max-h-[100vh] max-lg:min-h-full max-lg:w-full max-lg:flex-col max-lg:justify-end max-lg:overflow-scroll max-lg:bg-black/50 lg:contents"
				class:opacity-100={dropDownOpen}
				class:max-lg:hidden={!dropDownOpen}
				bind:this={dropDownRef}
				use:composedGesture={(r) => {
					const scrollFns = r(scrollComposition, { delay: 0 });
					return (evs, ev) => {
						if (window.screen.width >= 1024) return;
						const top = parseFloat(dropDownRef.style.top);
						if (dropDownRef.scrollTop == 0 && (ev.offsetY > 0 || top > 0)) {
							dropDownRef.style.top = `${top + ev.offsetY}px`;
							if (parseFloat(dropDownRef.style.top) > window.screen.height / 3) {
								shouldHideDropdown = true;
							}
							return;
						}
						//@ts-expect-error: weird shit?
						scrollFns.onMove(evs, ev);
					};
				}}
				onpointerup={() => {
					if (shouldHideDropdown) {
						dropDownOpen = false;
						shouldHideDropdown = false;
					} else {
						dropDownRef.style.top = '0px';
					}
				}}
			>
				<div
					class="bg-foreground mt-2 flex min-w-100 flex-col gap-5 rounded-xl pb-2 transition-all transition-discrete max-lg:min-h-[25%] lg:absolute starting:opacity-0"
					class:opacity-100={dropDownOpen}
					class:hidden={!dropDownOpen}
				>
					<div class="bg-foreground">
						{#each rooms as room, i}
							<div>
								<div class="bg-primary p-2" class:rounded-t-xl={i == 0}>
									<h1>Pokój {i + 1}</h1>
								</div>
								<div class="flex justify-between p-2">
									<span> Osób </span>
									<span>
										<button type="button" onclick={() => rooms[i] > 0 && rooms[i]--}>-</button>
										{room}
										<button type="button" onclick={() => rooms[i]++}>+</button>

										<button
											type="button"
											onclick={() => {
												rooms.splice(i, 1);
											}}>X</button
										>
									</span>
								</div>
							</div>
						{/each}
					</div>
					<div class="flex justify-center">
						<Button
							type="button"
							onclick={() => rooms.push(peopleNum != '' ? Number(peopleNum) : 2)}
						>
							Dodaj pokój
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<label for="maxPrice">Max Price:</label>
		<Input type="number" name="maxPrice" id="amount" min={0} required={false} />
	</div>
	<input type="hidden" value={JSON.stringify(rooms)} name="rooms" />
	<input type="hidden" name="roomType" value={data.roomType} />

	<Button>Search</Button>
</form>
