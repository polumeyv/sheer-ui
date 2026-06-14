<script lang="ts">
	import { Time } from '@internationalized/date';
	import { TimeField } from '$lib/components/primitive/time-field/index';

	let value = $state(new Time(12, 30));
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<TimeField.Root bind:value>
		<TimeField.Label class="text-sm font-medium">Appointment time</TimeField.Label>
		<TimeField.Input
			class="border-input bg-background flex h-10 w-full items-center rounded-md border px-3 py-1 text-sm shadow-sm"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value: segValue } , segIndex (segIndex)}
					{#if part === 'literal'}
						<TimeField.Segment {part} class="text-muted-foreground px-0.5">
							{segValue}
						</TimeField.Segment>
					{:else}
						<TimeField.Segment
							{part}
							class="rounded px-0.5 focus:bg-accent focus:text-accent-foreground focus:outline-none"
						>
							{segValue}
						</TimeField.Segment>
					{/if}
				{/each}
			{/snippet}
		</TimeField.Input>
	</TimeField.Root>
</div>
