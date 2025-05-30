<script lang="ts">
	import Button from '$lib/client/components/button.svelte';
	import Input from '$lib/client/components/input.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import type { PageProps } from './$types';
	import { composedGesture, scrollComposition, type RegisterFnType } from 'svelte-gestures';
	import { _ } from 'svelte-i18n';

	const { data }: PageProps = $props();
	let rooms: number[] = $state([]);
	let peopleNum = $state(data.selectedRoomType ? data.maxRoomSize?.toString() : '');
	$effect(() => console.log(peopleNum));

	let from = $state('');
	let until = $state('');
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	let dropDownOpen = $state(false);
	let dropDownRef: HTMLDivElement;
	let dropDownContentRef: HTMLDivElement;
	let shouldHideDropdown = false;
	const dropDownComposedGesture = (
		r: RegisterFnType
	): ((evs: PointerEvent[], ev: PointerEvent) => void) => {
		const scrollFns = r(scrollComposition, { delay: 0 });
		return (evs, ev) => {
			ev.stopPropagation();
			if (window.screen.width >= 1024) return;
			const top = parseFloat(dropDownRef.style.top);
			if (dropDownContentRef.scrollTop == 0 && (ev.movementY > 0 || top > 0)) {
				dropDownRef.style.top = `${top + ev.movementY}px`;
				if (parseFloat(dropDownRef.style.top) > window.screen.height / 3) {
					shouldHideDropdown = true;
				}
				return;
			}
			//@ts-expect-error: sus
			scrollFns.onMove(evs, ev);
		};
	};
	const dropDownPointerUp = () => {
		if (shouldHideDropdown) {
			shouldHideDropdown = false;
			const fn = () => {
				const top = parseFloat(dropDownRef.style.top);
				if (top > window.screen.height) {
					dropDownOpen = false;
					return;
				}
				dropDownRef.style.top = `${top + 20}px`;
				setTimeout(fn, 10);
			};
			fn();
		} else {
			const fn = () => {
				const top = parseFloat(dropDownRef.style.top);
				if (top == 0) return;
				dropDownRef.style.top = `${top > 10 ? top - 10 : 0}px`;
				setTimeout(fn, 10);
			};
			fn();
		}
	};
</script>

<h1 class="text-center text-4xl">{$_('search_rooms')}</h1>
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
		<div class="bg-foreground flex flex-col gap-5 rounded-xl px-7 py-5">
			<label for="from" class="text-center">{$_('arrival')}</label>
			<Input
				type="date"
				name="from"
				id="from"
				bind:value={from}
				min={tomorrow.toLocaleDateString('fr-ca')}
			/>
		</div>
		<div class="bg-foreground flex flex-col gap-5 rounded-xl px-7 py-5">
			<label for="until" class="text-center">{$_('leave')}</label>
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
				class="bg-foreground relative flex min-h-[100%] flex-col justify-evenly rounded-xl px-7 py-5"
				type="button"
				onclick={() => {
					dropDownOpen = !dropDownOpen;
					dropDownRef.style.top = '0px';
				}}
			>
				<div>
					<p>{$_('rooms')}: {rooms.length}</p>
					<p>{$_('people')}: {rooms.reduce((a, b) => a + b, 0)}</p>
				</div>
			</button>
			<div
				class="max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:flex max-lg:max-h-[100vh] max-lg:min-h-full max-lg:w-full max-lg:flex-col max-lg:justify-end max-lg:bg-black/50 lg:contents"
				class:opacity-100={dropDownOpen}
				class:max-lg:hidden={!dropDownOpen}
				bind:this={dropDownRef}
				use:composedGesture={dropDownComposedGesture}
				onpointerup={dropDownPointerUp}
			>
				<div
					class="bg-foreground mt-2 flex max-h-[90vh] min-w-100 flex-col gap-5 rounded-xl pb-5 transition-all transition-discrete max-lg:min-h-[25%] max-lg:overflow-scroll lg:absolute starting:opacity-0"
					class:opacity-100={dropDownOpen}
					class:hidden={!dropDownOpen}
					bind:this={dropDownContentRef}
					use:composedGesture={dropDownComposedGesture}
					onpointerup={dropDownPointerUp}
				>
					<div>
						{#each rooms as room, i}
							<div>
								<div class="bg-primary p-2" class:rounded-t-xl={i == 0}>
									<h1 class="text-black">{$_('room')} {i + 1}</h1>
								</div>
								<div class="flex justify-between p-2">
									<span> {$_('people')} </span>
									<span class="flex items-center gap-5">
										<Button
											type="button"
											class="h-10 w-10 !rounded-full !p-0"
											disabled={data.selectedRoomType}
											onclick={() => rooms[i] > 1 && rooms[i]--}
										>
											-
										</Button>
										{room}
										<Button
											type="button"
											class="h-10 w-10 !rounded-full !p-0"
											disabled={data.selectedRoomType}
											onclick={() => rooms[i] < (data.maxRoomSize ?? Infinity) && rooms[i]++}
										>
											+
										</Button>

										<Button
											type="button"
											class="flex h-10 w-10 items-center justify-center !rounded-full !p-0"
											onclick={() => {
												rooms.splice(i, 1);
											}}
										>
											<Close />
										</Button>
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
							{$_('add_room')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col justify-center">
		<label for="maxPrice">{$_('max_price')}</label>
		<Input type="number" name="maxPrice" id="amount" min={0} required={false} />
	</div>
	<input type="hidden" value={JSON.stringify(rooms)} name="rooms" />
	<input type="hidden" name="roomType" value={data.roomType} />

	<Button>{$_('search')}</Button>
</form>
