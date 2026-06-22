<script lang="ts" module>
	export const title = 'Group';
</script>

<script lang="ts">
	import * as Checkbox from '$lib/components/checkbox/index.js';
	import { Label } from '$lib/components/label/index.js';

	let value = $state(['recents']);

	const items = [
		{ value: 'recents', label: 'Recents' },
		{ value: 'home', label: 'Home' },
		{ value: 'applications', label: 'Applications' },
		{ value: 'desktop', label: 'Desktop' },
	];
</script>

<Checkbox.Group bind:value class="grid gap-3">
	<Checkbox.GroupLabel class="text-sm font-medium">Sidebar</Checkbox.GroupLabel>
	{#each items as item (item.value)}
		<div class="flex items-center gap-2">
			<Checkbox.Root id={item.value} value={item.value} />
			<Label.Root for={item.value}>{item.label}</Label.Root>
		</div>
	{/each}
</Checkbox.Group>
