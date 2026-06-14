<script lang="ts">
	import { CalendarDate } from '@internationalized/date';
	import { DateField } from '$lib/components/date-field/index';

	let value = $state(new CalendarDate(2025, 1, 1));
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<DateField.Root bind:value>
		<DateField.Label class="text-sm font-medium">Appointment date</DateField.Label>
		<DateField.Input
			class="border-input bg-background flex h-10 w-full items-center rounded-md border px-3 py-1 text-sm shadow-sm"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value: segValue } , segIndex (segIndex)}
					{#if part === 'literal'}
						<DateField.Segment {part} class="text-muted-foreground px-0.5">
							{segValue}
						</DateField.Segment>
					{:else}
						<DateField.Segment
							{part}
							class="rounded px-0.5 focus:bg-accent focus:text-accent-foreground focus:outline-none"
						>
							{segValue}
						</DateField.Segment>
					{/if}
				{/each}
			{/snippet}
		</DateField.Input>
	</DateField.Root>
</div>
