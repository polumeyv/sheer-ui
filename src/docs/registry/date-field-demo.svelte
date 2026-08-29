<script lang="ts">
	// `components/date-field` is the headless segmented bits primitive — it ships no
	// styling, so the consumer supplies the bordered field shell and per-segment
	// utilities (the shadcn convention). The Input renders one Segment per part via
	// its `segments` snippet.
	import * as DateField from '../../lib/components/date-field/index.js';
	import type { DateValue } from '@internationalized/date';

	let value = $state<DateValue>();
</script>

<DateField.Root bind:value>
	<DateField.Label class="text-sm font-medium">Date of birth</DateField.Label>
	<DateField.Input
		class="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 mt-1.5 inline-flex h-9 w-fit items-center rounded-md border px-3 py-1 text-sm focus-within:ring-3">
		{#snippet children({ segments })}
			{#each segments as segment, i (`${segment.part}-${i}`)}
				<DateField.Segment
					part={segment.part}
					class="data-placeholder:text-muted-foreground focus:bg-accent focus:text-accent-foreground rounded px-0.5 tabular-nums focus:outline-none">
					{segment.value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
