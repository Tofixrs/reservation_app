<script lang="ts">
	import '../app.css';
	import DarkMode from 'svelte-google-materialdesign-icons/Dark_mode.svelte';
	import LightMode from 'svelte-google-materialdesign-icons/Light_mode.svelte';
	import Account from 'svelte-google-materialdesign-icons/Account_circle.svelte';
	import Home from 'svelte-google-materialdesign-icons/Home.svelte';
	import Search from 'svelte-google-materialdesign-icons/Search.svelte';
	import { _ } from 'svelte-i18n';
	import { darkMode } from '$lib/client/stores';
	let { children } = $props();
	$effect(() => {
		const root = document.querySelector(':root')!;
		if (darkMode == undefined) return;
		root.classList.toggle('dark', $darkMode);
		root.classList.toggle('light', !$darkMode);

		const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
		if (darkModeMedia.matches == $darkMode) {
			localStorage.removeItem('darkMode');
		} else {
			localStorage.setItem('darkMode', `${$darkMode}`);
		}
	});
</script>

<header
	class="flex justify-between rounded-b-md border-b-2 border-gray-300 px-[5%] py-2 text-center text-3xl"
>
	<div class="flex gap-2 md:gap-10">
		<a href="/" class="text-text no-underline">
			<Home size="36" />
		</a>
		<a href="/reservation" class="text-text no-underline">
			<Search size="36" />
		</a>
		<a href="/rooms" class="text-text no-underline">{$_('rooms')}</a>
	</div>
	<div class="flex justify-end gap-2 md:gap-10">
		<button onclick={() => darkMode.set(!$darkMode)}>
			{#if $darkMode}
				<DarkMode size={'36'} />
			{:else}
				<LightMode size={'36'} />
			{/if}
		</button>
		<a href="/account" class="text-text no-underline">
			<Account size={'36'} />
		</a>
	</div>
</header>
<main class="flex grow flex-col p-5">
	{@render children()}
</main>
