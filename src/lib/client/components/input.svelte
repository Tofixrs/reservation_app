<script lang="ts">
	interface Props {
		name: string;
		type: string;
		id: string;
		value?: string;
		focus?: boolean;
		valid?: string;
		required?: boolean;
	}
	let input: HTMLInputElement | undefined = $state();
	let {
		name,
		type,
		id,
		value = $bindable(),
		focus = $bindable(),
		valid = '',
		required = true
	}: Props = $props();
	$effect(() => {
		if (!input) return;

		input.setCustomValidity(valid);
	});
</script>

<input
	{type}
	{name}
	{id}
	class="grow rounded-2xl border-2 border-text bg-background px-5 py-2 [&:user-invalid]:border-red-500"
	onfocus={() => (focus = true)}
	onblur={() => (focus = false)}
	bind:this={input}
	bind:value
	{required}
/>
