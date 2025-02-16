<script lang="ts">
	import Input from '$lib/client/components/input.svelte';
	import type { PageProps } from './$types';

	let visible = $state(false);
	const { form, data }: PageProps = $props();
</script>

<form
	action={data?.changingEmail ? '?/changeEmail' : '?/verifyEmail'}
	method="post"
	class="flex flex-col gap-5"
>
	<div><label for="verificationCode">Please input verification code sent to your email</label></div>
	<input
		type="text"
		name="verificationCode"
		id="verificationCode"
		class="border-text bg-background rounded-xl border-2 px-5 py-2"
	/>
	<div>
		<input
			type="submit"
			value="Verify"
			class="border-text hover:border-primary hover:text-primary rounded-xl border-2 px-5 py-2 transition-colors"
		/>
	</div>
	{#if form?.invalid}
		<p class="text-red-500">Invalid verification code</p>
	{/if}
	{#if form?.expired}
		<p class="text-red-500">Code expired</p>
	{/if}
</form>
<form action="?/changeRequestedEmail" method="post" class="overflow-hidden">
	<button type="button" class="cursor-pointer" onclick={() => (visible = !visible)}>
		Wrong email?
	</button>
	<div class:translate-y-[-200px]={!visible} class="-z-10 flex flex-col gap-5 transition-transform">
		<div><label for="email">New Email</label></div>
		<Input type="email" name="email" id="email" />
		<input
			type="submit"
			value="Send code to new email"
			class="border-text hover:border-primary hover:text-primary rounded-xl border-2 px-5 py-2 transition-colors"
		/>
	</div>
</form>
