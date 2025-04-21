<script lang="ts">
	import type { PageProps } from './$types';
	import AuthButton from '$lib/client/components/authButton.svelte';
	import Button from '$lib/client/components/button.svelte';
	import { browser } from '$app/environment';
	import { _ } from 'svelte-i18n';

	let { form }: PageProps = $props();
	let after = $state('');
	if (browser) {
		const url = new URL(window.location.href);
		after = url.searchParams.get('after') ?? '';
	}
</script>

<div class="flex grow items-center justify-center">
	<div class="flex justify-center">
		<div
			class="flex flex-col justify-between gap-5 rounded-3xl border-2 border-gray-300 px-14 py-5"
		>
			<h1>Login</h1>
			<form method="POST" action="?/login" class="flex flex-col gap-1">
				<input type="hidden" name="after" value={after} />
				<div><label for="email">Email</label></div>
				<div class="flex grow">
					<input
						type="email"
						name="email"
						id="email"
						class="border-text bg-background grow rounded-2xl border-2 px-5 py-2"
					/>
				</div>
				<div><label for="email">{$_('password')}</label></div>
				<div class="flex">
					<input
						type="password"
						name="password"
						id="password"
						class="border-text bg-background grow rounded-2xl border-2 px-5 py-2"
					/>
				</div>
				<div>
					<Button>{$_('sign_in')}</Button>
				</div>
				<div class="text-red-500">
					{#if form?.wrongCredentials}
						{$_('wrong_credentials')}
					{/if}
				</div>
			</form>

			<AuthButton url={`/auth/github?after=${after}`} provider="Github" image="/github-mark.svg" />
			<AuthButton
				url={`/auth/google?after=${after}`}
				provider="Google"
				image="/google.svg"
				invert={false}
			/>
			<AuthButton
				url={`/auth/discord?after=${after}`}
				provider="Discord"
				image="/discord-mark-black.svg"
			/>

			<a href="/auth/register">{$_('sign_up_instead')}</a>
		</div>
	</div>
</div>
