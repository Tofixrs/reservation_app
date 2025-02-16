<script lang="ts">
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();
	import Input from '$lib/client/components/input.svelte';
</script>

<form action="?/addRoom" method="POST" enctype="multipart/form-data">
	<div><label for="name">Name</label></div>
	<div><Input name="name" id="name" type="text" /></div>
	<div><label for="size">Size</label></div>
	<div><Input type="number" id="size" name="size" min={0} /></div>
	<div><label for="desc">Description</label></div>
	<div><textarea name="desc" id="desc"></textarea></div>
	<div><label for="images">Preview Images</label></div>
	<div>
		<input
			type="file"
			name="images"
			id="images"
			multiple
			accept="image/jpeg, image/png, image/gif"
		/>
	</div>
	<input type="submit" value="Add room" />
	{#if form?.sucess}
		<p>Room added sucessfully</p>
	{/if}
</form>
