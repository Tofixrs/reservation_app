<script lang="ts">
	import type { PageProps } from './$types';
	import AuthButton from '$lib/client/components/authButton.svelte';

	let { form }: PageProps = $props();
</script>

<div class="flex justify-center">
	<div class="flex flex-col justify-between gap-5 rounded-3xl border-2 border-gray-300 px-14 py-5">
		<h1>Login</h1>
		<form method="POST" action="?/login" class="flex flex-col gap-1">
			<div><label for="email">Email</label></div>
			<div class="flex grow">
				<input
					type="email"
					name="email"
					id="email"
					class="border-text bg-background grow rounded-2xl border-2 px-5 py-2"
				/>
			</div>
			<div><label for="email">Password</label></div>
			<div class="flex">
				<input
					type="password"
					name="password"
					id="password"
					class="border-text bg-background grow rounded-2xl border-2 px-5 py-2"
				/>
			</div>
			<div>
				<input
					type="submit"
					value="Sign in"
					class="border-text hover:border-primary hover:text-primary rounded-xl border-2 px-5 py-2 transition-colors"
				/>
			</div>
			<div class="text-red-500">
				{#if form?.wrongCredentials}
					Wrong credentials
				{/if}
			</div>
		</form>

		<AuthButton url="/auth/github" provider="Github" image="/github-mark.svg" />
		<AuthButton url="/auth/google" provider="Google" image="/google.svg" invert={false} />
		<AuthButton url="/auth/discord" provider="Discord" image="/discord-mark-black.svg" />

		<a href="/auth/register">Sign up instead</a>
	</div>
</div>
