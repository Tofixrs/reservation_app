<script lang="ts">
	import ArrowOutward from 'svelte-google-materialdesign-icons/Arrow_outward.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<div class="flex justify-center">
	<div class="flex flex-col justify-between gap-5 rounded-3xl border-2 border-gray-300 px-14 py-5">
		<h1>Login</h1>
		<form method="POST" action="?/login" class="flex flex-col">
			<div><label for="email">Email</label></div>
			<div class="flex flex-grow">
				<input
					type="email"
					name="email"
					id="email"
					class="flex-grow rounded-2xl border-2 border-text bg-background px-5 py-2"
				/>
			</div>
			<div><label for="email">Password</label></div>
			<div class="flex">
				<input
					type="password"
					name="password"
					id="password"
					class="flex-grow rounded-2xl border-2 border-text bg-background px-5 py-2"
				/>
			</div>
			<div><input type="submit" value="Sign in" /></div>
			<div class="text-red-500">
				{#if form?.wrongCredentials}
					Wrong credentials
				{/if}
				{#if form?.wrongProvider}
					This email was used with another provider
				{/if}
			</div>
		</form>

		<a
			href="/auth/github"
			class="rounded-xl border-2 border-text px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/github-mark.svg" class="inline-block h-7 w-7 dark:invert" alt="" />
			<ArrowOutward class="inline-block" />
		</a>
		<a
			href="/auth/discord"
			class="rounded-xl border-2 border-text px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/discord-mark-black.svg" class="inline-block h-7 w-7 dark:invert" alt="" />
			<ArrowOutward class="inline-block" />
		</a>
		<a
			href="/auth/google"
			class="rounded-xl border-2 border-text px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
		>
			<span> Log in with </span>
			<img src="/google.svg" class="inline-block h-7 w-7" alt="" />
			<ArrowOutward class="inline-block" />
		</a>

		<a href="/register">Sign up instead</a>
	</div>
</div>
