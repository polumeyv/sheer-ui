<script lang="ts">
	import * as RadioGroup from '../components/radio-group-native/index.js';
	import { Label } from '../components/label/index.js';

	let value = $state('comfortable');

	const items = [
		{ value: 'default', label: 'Default' },
		{ value: 'comfortable', label: 'Comfortable' },
		{ value: 'compact', label: 'Compact' },
	];
</script>

<RadioGroup.Root bind:value>
	{#each items as item (item.value)}
		<div class="flex items-center gap-2">
			<RadioGroup.Item value={item.value} id={item.value} />
			<Label.Root for={item.value}>{item.label}</Label.Root>
		</div>
	{/each}
</RadioGroup.Root>
