<script lang="ts" module>
	export const title = 'Multiple';
</script>

<script lang="ts">
	import * as ToggleGroup from '../../lib/components/toggle-group/index.js';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';

	let value = $state(['bold']);
</script>

<ToggleGroup.Root type="multiple" variant="outline" bind:value>
	<ToggleGroup.Item value="bold" aria-label="Toggle bold">
		<Bold />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="italic" aria-label="Toggle italic">
		<Italic />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="underline" aria-label="Toggle underline">
		<Underline />
	</ToggleGroup.Item>
</ToggleGroup.Root>
