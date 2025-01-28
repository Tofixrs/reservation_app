<script lang="ts">
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();
</script>

<form action="?/verifyEmail" method="post">
	<div><label for="verificationCode">Please input verification code sent to your email</label></div>
	<input
		type="text"
		name="verificationCode"
		id="verificationCode"
		class="rounded-xl border-2 border-text bg-background px-5 py-2"
	/>
	<input type="submit" value="Verify" />
	{#if form?.invalid}
		<p class="text-red-500">Invalid verification code</p>
	{/if}
	{#if form?.expired}
		<p class="text-red-500">Code expired</p>
	{/if}
</form>
