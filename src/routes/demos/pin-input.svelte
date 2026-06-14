<script lang="ts">
	import { PinInput } from '$lib/components/pin-input/index';
	import { REGEXP_ONLY_DIGITS } from '$lib/components/pin-input/pin-input.svelte';

	let value = $state('');
</script>

<div class="flex flex-col items-center gap-3">
	<PinInput.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value class="flex items-center gap-2">
		{#snippet children({ cells })}
			{#each cells as cell, i (i)}
				<PinInput.Cell
					{cell}
					class={[
						'border-input relative flex size-10 items-center justify-center rounded-md border text-sm transition-all outline-none',
						cell.isActive && 'border-ring ring-ring/50 z-10 ring-[3px]'
					]}
				>
					{cell.char}
					{#if cell.hasFakeCaret}
						<div
							class="pointer-events-none absolute inset-0 flex items-center justify-center"
						>
							<div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
						</div>
					{/if}
				</PinInput.Cell>
			{/each}
		{/snippet}
	</PinInput.Root>

	<p class="text-muted-foreground text-sm">
		{value === '' ? 'Enter your one-time password.' : `You entered: ${value}`}
	</p>
</div>
