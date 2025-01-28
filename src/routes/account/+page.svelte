<script lang="ts">
	import Input from '$lib/client/components/input.svelte';
	import { Provider } from '$lib/provider';
	import type { PageProps } from './$types';

	const { form, data }: PageProps = $props();
	let password = $state('');
	let passwordFocus = $state(false);
	let confirmPassword = $state('');
	let validLength = $state(false);
	let specialChars = $state(false);
	let bigLetter = $state(false);
	let numbers = $state(false);

	let samePasswords = $derived(password == confirmPassword && password != '');

	$effect(() => {
		validLength = password.length >= 8;
		bigLetter = /[A-Z]/.test(password);
		numbers = /[0-9]/.test(password);
		specialChars = /[^0-9A-Za-z]/.test(password);
	});

	let validPassword = $derived(validLength && bigLetter && numbers && specialChars);
	let passwordCheckVisible = $derived((password != '' || passwordFocus) && !validPassword);

	function onSubmit(evt: SubmitEvent) {
		if (!validPassword || !samePasswords) evt.preventDefault();
	}
</script>

<form action="?/changePassword" method="POST" onsubmit={onSubmit} class="flex flex-col gap-1">
	<h1 class="text-3xl">Change password</h1>
	<div>
		<label for="currentPassword">Current password</label>
	</div>
	<div class="flex">
		<Input type="password" name="currentPassword" id="currentPassword" required={false} />
	</div>
	<div>
		<label for="password">Password</label>
	</div>
	<div class="flex">
		<Input
			id="password"
			name="password"
			type="password"
			bind:value={password}
			bind:focus={passwordFocus}
			valid={!validPassword ? "Password doesn't meet all requirements" : ''}
		/>
	</div>
	<label for="password">Confirm password</label>
	<div class="flex">
		<Input
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			bind:value={confirmPassword}
			valid={samePasswords ? '' : 'Passwords dont match'}
		/>
	</div>
	<div class="overflow-hidden">
		<div
			class="flex justify-between gap-5 transition-transform duration-300"
			class:translate-y-[-100px]={!passwordCheckVisible}
			class:translate-y-0={passwordCheckVisible}
		>
			<div
				class="border-b-2 text-center"
				class:border-green-500={validLength}
				class:border-red-500={!validLength}
			>
				Length
			</div>
			<div
				class="border-b-2 text-center"
				class:border-green-500={bigLetter}
				class:border-red-500={!bigLetter}
			>
				Big letter
			</div>
			<div
				class="border-b-2 text-center"
				class:border-gren-500={numbers}
				class:border-red-500={!numbers}
			>
				Number
			</div>
			<div
				class="border-b-2 text-center"
				class:border-green-500={specialChars}
				class:border-red-500={!specialChars}
			>
				Special char
			</div>
		</div>
	</div>

	<div>
		<input
			type="submit"
			value="Change password"
			class="rounded-xl border-2 border-text px-5 py-2 transition-colors hover:border-primary hover:text-primary"
		/>
	</div>
	{#if form?.invalidPass}
		Current password is invalid
	{/if}
	{#if form?.wrongProvider}
		Cant change password on accounts logged from other providers
	{/if}
</form>
<div>
	<h1 class="text-3xl">Change email</h1>
	{#if !form?.codeSent}
		<form action="?/sendEmailChangeCode" method="POST">
			<div><label for="passwordCode">Password</label></div>
			<Input id="codePassword" name="codePassword" type="password" required />
			<input
				type="submit"
				value="Send code"
				class="rounded-xl border-2 border-text px-5 py-2 transition-colors hover:border-primary hover:text-primary"
			/>
		</form>
	{:else}
		<form action="?/changeEmail" method="POST">
			<div><label for="changeEmailCode">Code:</label></div>
			<Input id="changeEmailCode" name="changeEmailCode" type="text" required />
			<div><label for="newEmail">New Email:</label></div>
			<Input id="New Email" name="newEmail" type="text" required />
			<input
				type="submit"
				value="Send code"
				class="rounded-xl border-2 border-text px-5 py-2 transition-colors hover:border-primary hover:text-primary"
			/>
		</form>
		<p>Verification code has been sent to your email</p>
	{/if}
</div>

<hr class="my-5 h-[1px] border-none bg-text" />
<form action="?/logout" method="POST">
	<div>
		<input
			type="submit"
			value="Sign out"
			class="rounded-xl border-2 border-text px-5 py-2 transition-colors hover:border-primary hover:text-primary"
		/>
	</div>
</form>
