<script lang="ts">
	import type { PageProps } from './$types';

	const { form, data }: PageProps = $props();
	import Input from '$lib/client/components/input.svelte';
	import Button from '$lib/client/components/button.svelte';
</script>

<div class="flex flex-col gap-10">
	<form action="?/addRoom" method="post" class="flex flex-col gap-5">
		<h1 class="text-center text-4xl">Add rooms</h1>
		<label for="roomType">Room type:</label>
		<select name="roomType" id="roomType" class="rounded-2xl border-2 border-white px-5 py-2">
			{#each data.roomTypes as roomType}
				<option value={roomType.id}>{roomType.name}</option>
			{/each}
		</select>
		<label for="amount">Amount</label>
		<Input type="number" name="amount" id="amount" />
		<Button>Add rooms</Button>
	</form>

	<form
		action="?/addRoomType"
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-5"
	>
		<h1 class="text-center text-4xl">Add room types</h1>
		<label for="name">Name</label>
		<Input name="name" id="name" type="text" />
		<label for="size">Size</label>
		<Input type="number" id="size" name="size" min={0} />
		<label for="price">Price</label>
		<Input type="number" id="price" name="price" min={0} />
		<label for="desc">Description</label>
		<textarea name="desc" id="desc" class="rounded-2xl border-2 border-white px-5 py-2"></textarea>
		<label for="images">Preview Images</label>

		<input
			type="file"
			name="images"
			id="images"
			multiple
			accept="image/jpeg, image/png, image/gif"
		/>

		<Button>Add room</Button>
		{#if form?.sucess}
			<p>Room added sucessfully</p>
		{/if}
	</form>
</div>
