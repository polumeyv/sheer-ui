<script lang="ts" module>
	export const title = 'Horizontal';
</script>

<script lang="ts">
	import * as RadioGroup from '$lib/components/radio-group-native/index.js';
	import { Label } from '$lib/components/label/index.js';

	let value = $state('');

	const sizes = ['Small', 'Medium', 'Large'];
</script>

<div class="flex flex-col gap-3">
	<RadioGroup.Root bind:value orientation="horizontal" class="grid-flow-col justify-start">
		{#each sizes as size (size)}
			<div class="flex items-center gap-2">
				<RadioGroup.Item value={size.toLowerCase()} id="rg-h-{size}" />
				<Label.Root for="rg-h-{size}">{size}</Label.Root>
			</div>
		{/each}
	</RadioGroup.Root>
	<p class="text-muted-foreground text-sm">Starts with no selection: Tab lands on the first radio, arrows select.</p>
</div>
