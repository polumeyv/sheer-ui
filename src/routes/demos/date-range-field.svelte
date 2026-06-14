<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateRangeField } from '$lib/components/primitive/date-range-field/index';
	import type { DateRange } from '$lib/shared/index';

	let value = $state<DateRange>({
		start: new CalendarDate(2026, 6, 13),
		end: new CalendarDate(2026, 6, 20)
	});
</script>

<DateRangeField.Root bind:value class="flex w-full max-w-sm flex-col gap-1.5">
	<DateRangeField.Label class="text-sm font-medium">Trip dates</DateRangeField.Label>
	<div
		class="border-input bg-background flex w-full items-center rounded-md border px-3 py-2 text-sm"
	>
		{#each ['start', 'end'] as const as type (type)}
			<DateRangeField.Input {type} class="flex items-center">
				{#snippet children({ segments })}
					{#each segments as { part, value: segmentValue }, segIndex (segIndex)}
						<DateRangeField.Segment
							{part}
							class="rounded px-0.5 focus:bg-accent focus:text-accent-foreground focus:outline-none data-[placeholder]:text-muted-foreground"
						>
							{segmentValue}
						</DateRangeField.Segment>
					{/each}
				{/snippet}
			</DateRangeField.Input>
			{#if type === 'start'}
				<span aria-hidden="true" class="text-muted-foreground px-2">–</span>
			{/if}
		{/each}
	</div>
</DateRangeField.Root>
