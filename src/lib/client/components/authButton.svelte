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
	class="border-text text-text hover:border-primary hover:text-primary flex items-center rounded-xl border-2 px-5 py-2 no-underline transition-colors"
>
	<img src={image} class={`mr-5 inline-block h-7 w-7 ${invert ? 'dark:invert' : ''}`} alt="" />
	<span>{`Continue with ${provider}`}</span>
	<span class="grow"></span>
</a>
