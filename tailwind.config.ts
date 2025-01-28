import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: ['variant', ['@media (prefers-color-scheme: dark) {&:not(.light *)}', '&:is(.dark *)']],
	theme: {
		extend: {
			colors: {
				text: 'var(--text)',
				background: 'var(--background)',
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				accent: 'var(--accent)'
			}
		}
	},

	plugins: []
} satisfies Config;
