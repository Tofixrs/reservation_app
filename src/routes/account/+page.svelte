<script lang="ts">
	import Edit from 'svelte-google-materialdesign-icons/Edit.svelte';
	import Close from 'svelte-google-materialdesign-icons/Close.svelte';
	import Button from '$lib/client/components/button.svelte';
	import Input from '$lib/client/components/input.svelte';
	import type { PageProps } from './$types';
	import { _, locale } from 'svelte-i18n';

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
	<div class="flex min-w-full flex-col gap-5 py-5 lg:min-w-[60%] lg:px-20">
		<h1 class="text-5xl">{$_('login_data')}</h1>
		<div>
			<div class="flex justify-between">
				<div>
					<span>Email:</span>
					<span>
						{data.user.email
							.split('')
							.map((v, i) =>
								i > (1 / 8) * data.user.email.length && i < (2 / 3) * data.user.email.length
									? '*'
									: v
							)
							.join('')}
					</span>
				</div>
				<button onclick={() => (emailModalOpen = !emailModalOpen)}><Edit /></button>
			</div>
			<div class="flex justify-between">
				<div>
					<span>{$_('password')}:</span>
					<span>
						{Array.from({ length: 8 })
							.map(() => '*')
							.join('')}
					</span>
				</div>
				<button onclick={() => (passwordModalOpen = !passwordModalOpen)}><Edit /></button>
			</div>
		</div>
		<h1 class="text-5xl">{$_('reservation_history')}</h1>
		<div>
			<table class="w-full">
				<thead>
					<tr>
						<th></th>
						<th>{$_('from')}</th>
						<th>{$_('to')}</th>
					</tr>
				</thead>
				<tbody>
					{#each data.reservations as reservations, i}
						<tr>
							<td>{i}</td>
							<td>
								{reservations.timeOfArrival.toLocaleDateString($locale ?? 'en-US', {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric'
								})}
							</td>
							<td>
								{reservations.timeOfLeave.toLocaleDateString($locale ?? 'en-US', {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric'
								})}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div>
			<hr class="bg-text my-5 h-[1px] border-none" />
			<form action="?/logout" method="POST">
				<div>
					<Button>{$_('sign_out')}</Button>
				</div>
			</form>
		</div>
	</div>
</div>
<div
	class="fixed top-0 left-0 grid min-h-[100vh] min-w-[100vw] place-items-center bg-black/50"
	class:hidden={!emailModalOpen}
>
	<button
		class="hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 border-white text-white transition-colors"
		onclick={() => (emailModalOpen = false)}
	>
		<Close />
	</button>
	<div class="border-text bg-background rounded-xl border-2 border-solid px-20 py-10">
		<h1 class="text-3xl">{$_('change_email')}</h1>
		{#if !form?.codeSent}
			<form action="?/sendEmailChangeCode" method="POST">
				<div><label for="passwordCode">{$_('password')}</label></div>
				<Input id="codePassword" name="codePassword" type="password" required />
				<Button>{$_('send_code')}</Button>
			</form>
		{:else}
			<form action="?/changeEmail" method="POST">
				<div><label for="changeEmailCode">{$_('code')}:</label></div>
				<Input id="changeEmailCode" name="changeEmailCode" type="text" required />
				<div><label for="newEmail">{$_('new_email')}:</label></div>
				<Input id="newEmail" name="newEmail" type="text" required />
				<Button>{$_('send_code')}</Button>
			</form>
			<p>{$_('code_sent')}</p>
		{/if}
	</div>
</div>
<div
	class="fixed top-0 left-0 grid min-h-[100vh] min-w-[100vw] place-items-center bg-black/50"
	class:hidden={!passwordModalOpen}
>
	<button
		class="hover:border-primary hover:text-primary absolute top-10 left-10 grid h-10 w-10 place-items-center rounded-full border-2 border-white text-white transition-colors"
		onclick={() => (passwordModalOpen = false)}
	>
		<Close />
	</button>
	<div class="border-text bg-background rounded-xl border-2 border-solid px-20 py-10">
		<form action="?/changePassword" method="POST" onsubmit={onSubmit} class="flex flex-col gap-1">
			<h1 class="text-3xl">{$_('change_password')}</h1>
			<div>
				<label for="currentPassword">{$_('current_password')}</label>
			</div>
			<div class="flex">
				<Input type="password" name="currentPassword" id="currentPassword" required={false} />
			</div>
			<div>
				<label for="password">{$_('password')}</label>
			</div>
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
			<label for="password">{$_('confirm_password')}</label>
			<div class="flex">
				<Input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					bind:value={confirmPassword}
					valid={samePasswords ? '' : $_('password_dont_match')}
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

			<div>
				<Button>{$_('change_password_action')}</Button>
			</div>
			{#if form?.invalidPass}
				{$_('invalid_password')}
			{/if}
		</form>
	</div>
</div>

<style>
	table {
		--border-radius: var(--radius-xl);
		border: 1px solid var(--color-text);
		border-collapse: separate;
		border-left: 0;
		border-radius: var(--border-radius);
		border-spacing: 0px;
	}
	thead {
		display: table-header-group;
		vertical-align: middle;
		border-color: inherit;
		border-collapse: separate;
	}
	tr {
		display: table-row;
		vertical-align: inherit;
		border-color: inherit;
	}
	th,
	td {
		padding: 0.5em 1em;
		text-align: left;
		vertical-align: top;
		border-left: 1px solid var(--color-text);
	}
	td {
		border-top: 1px solid var(--color-text);
	}
	thead:first-child tr:first-child th:first-child,
	tbody:first-child tr:first-child td:first-child {
		border-radius: var(--border-radius) 0 0 0;
	}
	thead:last-child tr:last-child th:first-child,
	tbody:last-child tr:last-child td:first-child {
		border-radius: 0 0 0 var(--border-radius);
	}
</style>
