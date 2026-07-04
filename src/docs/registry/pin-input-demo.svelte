<script lang="ts">
	// `PinInput.Root` owns one hidden input and exposes the `cells` it should render;
	// `PinInput.Cell` already carries the shadcn slot styling (border, active ring,
	// fake caret), so the consumer only lays the cells out in a row.
	import { PinInput } from '../../lib/components/pin-input/index.js';

	let value = $state('');
</script>

<PinInput.Root bind:value maxlength={6} inputmode="numeric" pattern="^\d+$">
	{#snippet children({ cells })}
		<div class="flex items-center gap-2 *:data-[slot=pin-input-slot]:rounded-md *:data-[slot=pin-input-slot]:border">
			{#each cells as cell (cell)}
				<PinInput.Cell {cell} />
			{/each}
		</div>
	{/snippet}
</PinInput.Root>
