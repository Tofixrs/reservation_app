<script lang="ts">
	import Edit from 'svelte-google-materialdesign-icons/Edit.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import Button from '$lib/client/components/button.svelte';
	import Input from '$lib/client/components/input.svelte';
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
	let emailModalOpen = $state(form?.codeSent ?? false);
	let passwordModalOpen = $state(false);
</script>

<div class="flex flex-col items-center">
	<div class="min-w-full py-5 lg:min-w-[60%] lg:px-20">
		<div class="flex justify-between">
			<div>
				<span>Email:</span>
				<span>
					{data.user.email
						.split('')
						.map((v, i) =>
							i > (1 / 8) * data.user.email.length && i < (2 / 3) * data.user.email.length ? '*' : v
						)
						.join('')}
				</span>
			</div>
			<button onclick={() => (emailModalOpen = !emailModalOpen)}><Edit /></button>
		</div>
		<div class="flex justify-between">
			<div>
				<span>Password:</span>
				<span>
					{Array.from({ length: 8 })
						.map(() => '*')
						.join('')}
				</span>
			</div>
			<button onclick={() => (passwordModalOpen = !passwordModalOpen)}><Edit /></button>
		</div>
		<hr class="bg-text my-5 h-[1px] border-none" />
		<form action="?/logout" method="POST">
			<div>
				<Button>Sign out</Button>
			</div>
		</form>
	</div>
</div>
<div
	class="fixed top-0 left-0 grid min-h-[100vh] min-w-[100vw] place-items-center bg-black/50"
	class:hidden={!emailModalOpen}
>
	<button
		class="border-text hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-colors"
		onclick={() => (emailModalOpen = false)}
	>
		<Close />
	</button>
	<div class="border-text bg-background rounded-xl border-2 border-solid px-20 py-10">
		<h1 class="text-3xl">Change email</h1>
		{#if !form?.codeSent}
			<form action="?/sendEmailChangeCode" method="POST">
				<div><label for="passwordCode">Password</label></div>
				<Input id="codePassword" name="codePassword" type="password" required />
				<Button>Send code</Button>
			</form>
		{:else}
			<form action="?/changeEmail" method="POST">
				<div><label for="changeEmailCode">Code:</label></div>
				<Input id="changeEmailCode" name="changeEmailCode" type="text" required />
				<div><label for="newEmail">New Email:</label></div>
				<Input id="New Email" name="newEmail" type="text" required />
				<Button>Send code</Button>
			</form>
			<p>Verification code has been sent to your email</p>
		{/if}
	</div>
</div>
<div
	class="fixed top-0 left-0 grid min-h-[100vh] min-w-[100vw] place-items-center bg-black/50"
	class:hidden={!passwordModalOpen}
>
	<button
		class="border-text hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-colors"
		onclick={() => (passwordModalOpen = false)}
	>
		<Close />
	</button>
	<div class="border-text bg-background rounded-xl border-2 border-solid px-20 py-10">
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
				<Button>Change password</Button>
			</div>
			{#if form?.invalidPass}
				Current password is invalid
			{/if}
		</form>
	</div>
</div>

<!-- <h1 class="text-3xl">Change email</h1> -->
<!-- {#if !form?.codeSent} -->
<!-- 	<form action="?/sendEmailChangeCode" method="POST"> -->
<!-- 		<div><label for="passwordCode">Password</label></div> -->
<!-- 		<Input id="codePassword" name="codePassword" type="password" required /> -->
<!-- 		<Button>Send code</Button> -->
<!-- 	</form> -->
<!-- {:else} -->
<!-- 	<form action="?/changeEmail" method="POST"> -->
<!-- 		<div><label for="changeEmailCode">Code:</label></div> -->
<!-- 		<Input id="changeEmailCode" name="changeEmailCode" type="text" required /> -->
<!-- 		<div><label for="newEmail">New Email:</label></div> -->
<!-- 		<Input id="New Email" name="newEmail" type="text" required /> -->
<!-- 		<Button>Send code</Button> -->
<!-- 	</form> -->
<!-- 	<p>Verification code has been sent to your email</p> -->
<!-- {/if} -->
