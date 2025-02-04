<script lang="ts">
	import '../app.css';
	import DarkMode from 'svelte-google-materialdesign-icons/Dark_mode.svelte';
	import LightMode from 'svelte-google-materialdesign-icons/Light_mode.svelte';
	import Account from 'svelte-google-materialdesign-icons/Account_circle.svelte';
	let { children } = $props();
	let darkMode = $state<boolean | undefined>();
	$effect(() => {
		const root = document.querySelector(':root')!;
		if (darkMode == undefined) return;
		root.classList.toggle('dark', darkMode);
		root.classList.toggle('light', !darkMode);

		const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
		if (darkModeMedia.matches == darkMode) {
			localStorage.removeItem('darkMode');
		} else {
			localStorage.setItem('darkMode', `${darkMode}`);
		}
	});

	$effect.pre(() => {
		const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
		const storedTheme = localStorage.getItem('darkMode');
		if (!storedTheme) {
			darkMode = darkModeMedia.matches;
		} else {
			darkMode = storedTheme == 'true';
		}
	});
</script>

<header class="flex rounded-b-md border-b-2 border-gray-300 px-[5%] py-2 text-center text-3xl">
	<div class="grow"></div>
	<div class="grow justify-center">
		<a href="/" class="text-text no-underline">Hello</a>
	</div>
	<div class="flex grow flex-row-reverse">
		<a href="/account" class="text-text no-underline">
			<Account size={'36'} />
		</a>
		<button onclick={() => (darkMode = !darkMode)}>
			{#if darkMode}
				<DarkMode size={'36'} />
			{:else}
				<LightMode size={'36'} />
			{/if}
		</button>
	</div>
</header>
<main class="p-5">
	{@render children()}
</main>
