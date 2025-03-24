<script lang="ts">
	interface Props {
		name: string;
		type: string;
		id: string;
		value?: string;
		focus?: boolean;
		valid?: string;
		required?: boolean;
		min?: number | string | null;
		max?: number | string | null;
		disabled?: boolean;
	}
	let input: HTMLInputElement | undefined = $state();
	let {
		name,
		type,
		id,
		value = $bindable(),
		focus = $bindable(),
		valid = '',
		required = true,
		min,
		max,
		disabled
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
	class="border-text bg-background grow rounded-2xl border-2 px-5 py-2 [&:user-invalid]:border-red-500"
	onfocus={() => (focus = true)}
	onblur={() => (focus = false)}
	{min}
	{max}
	bind:this={input}
	bind:value
	{required}
	{disabled}
/>
