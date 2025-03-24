import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const theme = (() => {
	if (browser) {
		const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
		const storedTheme = localStorage.getItem('darkMode');
		if (!storedTheme) {
			return darkModeMedia.matches;
		} else {
			return storedTheme == 'true';
		}
	}
})();
export const darkMode = writable<boolean | undefined>(theme);
