<script lang="ts">
	import { Time } from '@internationalized/date';
	import { TimeRangeField } from '$lib/components/time-range-field/index';
	import type { TimeRange } from '$lib/shared/index';

	let value = $state<TimeRange>({
		start: new Time(9, 0),
		end: new Time(17, 30)
	});
</script>

<TimeRangeField.Root bind:value class="flex w-full max-w-sm flex-col gap-1.5">
	<TimeRangeField.Label class="text-sm font-medium">Working hours</TimeRangeField.Label>
	<div
		class="border-input bg-background flex w-full items-center rounded-md border px-3 py-2 text-sm"
	>
		{#each ['start', 'end'] as const as type (type)}
			<TimeRangeField.Input {type} class="flex items-center">
				{#snippet children({ segments })}
					{#each segments as { part, value: segmentValue }, segIndex (segIndex)}
						<TimeRangeField.Segment
							{part}
							class="rounded px-0.5 focus:bg-accent focus:text-accent-foreground focus:outline-none data-[placeholder]:text-muted-foreground"
						>
							{segmentValue}
						</TimeRangeField.Segment>
					{/each}
				{/snippet}
			</TimeRangeField.Input>
			{#if type === 'start'}
				<span aria-hidden="true" class="text-muted-foreground px-2">–</span>
			{/if}
		{/each}
	</div>
</TimeRangeField.Root>
