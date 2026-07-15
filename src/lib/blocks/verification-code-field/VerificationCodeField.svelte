<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Field from '../../components/field';
	import { PinInput, type RootProps as PinInputRootProps } from '../../components/pin-input';

	type InputEvent = Parameters<NonNullable<PinInputRootProps['oninput']>>[0];

	type Props = Omit<PinInputRootProps, 'children' | 'maxlength' | 'value'> & {
		value?: string;
		maxlength?: number;
		invalid?: boolean;
		errors?: { message?: string }[];
		description?: Snippet;
		ondirty?: () => void;
	};

	let {
		value = $bindable(''),
		maxlength = 6,
		invalid = false,
		errors,
		description,
		ondirty,
		oninput,
		inputmode = 'numeric',
		pattern = '^\\d+$',
		autocomplete = 'one-time-code',
		...rootProps
	}: Props = $props();

	const handleInput = (event: InputEvent) => {
		oninput?.(event);
		if (event.isTrusted) ondirty?.();
	};
</script>

<Field.Field data-invalid={invalid}>
	<PinInput.Root
		{...rootProps}
		bind:value
		{maxlength}
		{inputmode}
		{pattern}
		{autocomplete}
		aria-invalid={invalid}
		oninput={handleInput}>
		{#snippet children({ cells })}
			<div class="flex items-center gap-2 *:data-[slot=pin-input-slot]:rounded-md *:data-[slot=pin-input-slot]:border">
				{#each cells as cell (cell)}
					<PinInput.Cell aria-invalid={invalid} {cell} />
				{/each}
			</div>
		{/snippet}
	</PinInput.Root>
	<Field.Error errors={invalid ? errors : undefined} />
	{@render description?.()}
</Field.Field>
