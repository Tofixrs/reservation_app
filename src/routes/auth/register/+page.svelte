<script lang="ts">
	import type { PageProps } from './$types';
	import AuthButton from '$lib/client/components/authButton.svelte';
	import Input from '$lib/client/components/input.svelte';
	import Button from '$lib/client/components/button.svelte';
	import { _ } from 'svelte-i18n';

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

	const { form }: PageProps = $props();
</script>

<div class="flex grow items-center justify-center">
	<div class="flex justify-center">
		<div
			class="flex flex-col justify-between gap-5 rounded-3xl border-2 border-gray-300 px-14 py-5"
		>
			<h1>Sign up</h1>
			<form
				action="?/register"
				method="POST"
				class="flex flex-col gap-1"
				onsubmit={onSubmit}
				id="form"
			>
				<div><label for="email">Email</label></div>
				<div class="flex">
					<Input id="email" name="email" type="email" />
				</div>
				<div><label for="email">{$_('password')}</label></div>
				<div class="flex">
					<Input
						id="password"
						name="password"
						type="password"
						bind:value={password}
						bind:focus={passwordFocus}
						valid={!validPassword ? $_('password_no_requirements') : ''}
					/>
				</div>
				<div><label for="email">{$_('confirm_password')}</label></div>
				<div class="flex">
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						valid={samePasswords ? '' : $_('password_dont_match')}
						bind:value={confirmPassword}
					/>
				</div>
				<div class="overflow-hidden">
					<div
						class="flex justify-between gap-5 transition-transform duration-300"
						class:translate-y-0={passwordCheckVisible}
						class:translate-y-[-100px]={!passwordCheckVisible}
					>
						<div
							class="border-b-2 text-center"
							class:border-green-500={validLength}
							class:border-red-500={!validLength}
						>
							{$_('length')}
						</div>
						<div
							class="border-b-2 text-center"
							class:border-green-500={bigLetter}
							class:border-red-500={!bigLetter}
						>
							{$_('big_letter')}
						</div>
						<div
							class="border-b-2 text-center"
							class:border-gren-500={numbers}
							class:border-red-500={!numbers}
						>
							{$_('digit')}
						</div>
						<div
							class="border-b-2 text-center"
							class:border-green-500={specialChars}
							class:border-red-500={!specialChars}
						>
							{$_('special_char')}
						</div>
					</div>
				</div>
				<div class="text-red-500">
					{#if form?.alreadyExists}
						{$_('already_exists')}
					{/if}
				</div>
				<div>
					<Button>{$_('sign_up')}</Button>
				</div>
			</form>

			<AuthButton url="/auth/github" image="/github-mark.svg" provider="Github" />
			<AuthButton url="/auth/google" image="/google.svg" provider="Google" invert={false} />
			<AuthButton url="/auth/discord" image="/discord-mark-black.svg" provider="Discord" />

			<a href="/auth/login">{$_('sign_in_instead')}</a>
		</div>
	</div>
</div>
