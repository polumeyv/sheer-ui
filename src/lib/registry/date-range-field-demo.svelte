<script lang="ts">
	// Headless range variant: two Inputs (start/end) inside one bordered shell, each
	// rendering its segments via the `segments` snippet. Styling is the same shadcn
	// field/segment convention as the single date field.
	import * as DateRangeField from '$lib/components/date-range-field/index.js';
	import type { DateRange } from '$lib/shared/index.js';

	let value = $state<DateRange>();
</script>

<DateRangeField.Root bind:value>
	<DateRangeField.Label class="text-sm font-medium">Stay</DateRangeField.Label>
	<div
		class="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 mt-1.5 inline-flex h-9 w-fit items-center rounded-md border px-3 py-1 text-sm focus-within:ring-[3px]">
		<DateRangeField.Input type="start" class="inline-flex items-center">
			{#snippet children({ segments })}
				{#each segments as segment, i (`start-${segment.part}-${i}`)}
					<DateRangeField.Segment
						part={segment.part}
						class="data-[placeholder]:text-muted-foreground focus:bg-accent focus:text-accent-foreground rounded px-0.5 tabular-nums focus:outline-none">
						{segment.value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>
		<span class="text-muted-foreground px-2">–</span>
		<DateRangeField.Input type="end" class="inline-flex items-center">
			{#snippet children({ segments })}
				{#each segments as segment, i (`end-${segment.part}-${i}`)}
					<DateRangeField.Segment
						part={segment.part}
						class="data-[placeholder]:text-muted-foreground focus:bg-accent focus:text-accent-foreground rounded px-0.5 tabular-nums focus:outline-none">
						{segment.value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>
	</div>
</DateRangeField.Root>
