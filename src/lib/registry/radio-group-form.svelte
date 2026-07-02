<script lang="ts" module>
	export const title = 'In a Form';
</script>

<script lang="ts">
	import * as RadioGroup from '$lib/components/radio-group-native/index.js';
	import { Label } from '$lib/components/label/index.js';
	import { Button } from '$lib/components/button/index.js';

	let value = $state('');
	let submitted = $state('');

	const plans = ['starter', 'pro', 'enterprise'];
</script>

<form
	class="flex flex-col gap-4"
	onsubmit={(e) => {
		e.preventDefault();
		submitted = JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)));
	}}
	onreset={() => {
		value = '';
		submitted = '';
	}}>
	<RadioGroup.Root bind:value name="plan" required>
		{#each plans as plan (plan)}
			<div class="flex items-center gap-2">
				<RadioGroup.Item value={plan} id="rg-f-{plan}" />
				<Label.Root for="rg-f-{plan}" class="capitalize">{plan}</Label.Root>
			</div>
		{/each}
	</RadioGroup.Root>
	<div class="flex gap-2">
		<Button type="submit" size="sm">Submit</Button>
		<Button type="reset" size="sm" variant="outline">Reset</Button>
	</div>
	<p class="text-muted-foreground text-sm">
		{#if submitted}
			FormData: <code class="bg-muted rounded px-1 py-0.5">{submitted}</code>
		{:else}
			Submitting with nothing selected shows the native "required" bubble.
		{/if}
	</p>
</form>
