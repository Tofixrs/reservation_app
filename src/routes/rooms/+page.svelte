<script lang="ts">
	import type { PageProps } from './$types';

	const props: PageProps = $props();
</script>

{#each props.data.rooms as room}
	<div>
		{#each room.roomImageKeys as key}
			<img src={`https://qghdaylyq4.ufs.sh/f/${key.imageKey}`} alt="" />
		{/each}
	</div>
{/each}
