<script lang="ts">
	interface Props {
		url: string;
		image: string;
		provider: string;
		invert?: boolean;
	}
	let { url, image, provider, invert = true }: Props = $props();
</script>

<a
	href={url}
	class="flex rounded-xl border-2 border-text px-5 py-2 text-text no-underline transition-colors hover:border-primary hover:text-primary"
>
	<img src={image} class={`mr-5 inline-block h-7 w-7 ${invert ? 'dark:invert' : ''}`} alt="" />
	<span>{`Continue with ${provider}`}</span>
	<span class="grow"></span>
</a>
