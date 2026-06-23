<script lang="ts">
	import * as ToggleGroup from '$lib/components/toggle-group/index.js';
	import AlignLeft from '@lucide/svelte/icons/align-left';
	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignRight from '@lucide/svelte/icons/align-right';

	let value = $state('center');
</script>

<ToggleGroup.Root type="single" bind:value>
	<ToggleGroup.Item value="left" aria-label="Align left">
		<AlignLeft />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="center" aria-label="Align center">
		<AlignCenter />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="right" aria-label="Align right">
		<AlignRight />
	</ToggleGroup.Item>
</ToggleGroup.Root>
