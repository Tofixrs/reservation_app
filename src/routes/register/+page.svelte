<script lang="ts">
	import ArrowOutward from 'svelte-google-materialdesign-icons/Arrow_outward.svelte';
	import type { ActionData } from '../login/$types';

	let password = $state('');
	let confirmPassword = $state('');
	let validLength = $state(false);
	let specialChars = $state(false);
	let bigLetter = $state(false);
	let numbers = $state(false);

	let samePasswords = $derived(password == confirmPassword && password != '');

	$effect(() => {
		console.log(samePasswords);
	});

	$effect(() => {
		validLength = password.length >= 8;
		bigLetter = /[A-Z]/.test(password);
		numbers = /[0-9]/.test(password);
		specialChars = /[^0-9A-Za-z]/.test(password);
	});

	function onSubmit(evt: SubmitEvent) {
		if (!validLength || !bigLetter || !numbers || !specialChars) evt.preventDefault();
	}

	const { form }: ActionData = $props();
</script>

<div class="flex justify-center">
	<div class="flex flex-col justify-between gap-5 rounded-3xl border-2 border-gray-300 px-14 py-5">
		<h1>Sign up</h1>
		<form action="?/register" method="POST" class="flex flex-col" onsubmit={onSubmit}>
			<div><label for="email">Email</label></div>
			<div class="flex flex-grow">
				<input
					type="email"
					name="email"
					id="email"
					class="rounded-2xl border-2 border-text bg-background px-5 py-2"
				/>
			</div>
			<div><label for="email">Password</label></div>
			<div class="flex">
				<input
					type="password"
					name="password"
					id="password"
					class="rounded-2xl border-2 border-text bg-background px-5 py-2"
					bind:value={password}
				/>
			</div>
			<div class="flex justify-between gap-5">
				<div
					class={`border-b-2 text-center ${validLength ? 'border-b-green-500' : 'border-b-red-500'}`}
				>
					Length
				</div>
				<div
					class={`border-b-2 text-center ${bigLetter ? 'border-b-green-500' : 'border-b-red-500'}`}
				>
					Big letter
				</div>
				<div
					class={`border-b-2 text-center ${numbers ? 'border-b-green-500' : 'border-b-red-500'}`}
				>
					Number
				</div>
				<div
					class={`border-b-2 text-center ${specialChars ? 'border-b-green-500' : 'border-b-red-500'}`}
				>
					Special char
				</div>
			</div>
			<div><label for="email">Confirm password</label></div>
			<div class="flex">
				<input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					class="rounded-2xl border-2 border-text bg-background px-5 py-2"
					bind:value={confirmPassword}
				/>
			</div>
			<div class={`border-b-2 ${samePasswords ? 'border-b-green-500' : 'border-b-red-500'}`}>
				Same passwords
			</div>
			<div class="text-red-500">
				{#if form?.alreadyExists}
					Users with provided email already exists
				{/if}
			</div>
			<div><input type="submit" value="Sign up" /></div>
		</form>

		<a
			href="/auth/github"
			class="rounded-xl border-2 border-gray-300 px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/github-mark.svg" class="inline-block h-7 w-7 dark:invert" alt="" />
			<ArrowOutward class="inline-block" />
		</a>
		<a
			href="/auth/discord"
			class="rounded-xl border-2 border-gray-300 px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/discord-mark-black.svg" class="inline-block h-7 w-7 dark:invert" alt="" />
			<ArrowOutward class="inline-block" />
		</a>
		<a
			href="/auth/google"
			class="rounded-xl border-2 border-gray-300 px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/google.svg" class="inline-block h-7 w-7" alt="" />
			<ArrowOutward class="inline-block" />
		</a>

		<a href="/login">Sign in instead</a>
	</div>
</div>
