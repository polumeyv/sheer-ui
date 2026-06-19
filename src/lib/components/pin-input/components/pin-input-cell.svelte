<script lang="ts">
	import { boxWith, mergeProps } from '$lib/internal/toolbelt.js';
	import type { PinInputCellProps } from '../types.js';
	import { PinInputCellState } from '../pin-input.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), cell, child, children, ...restProps }: PinInputCellProps = $props();

	const cellState = PinInputCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		cell: boxWith(() => cell),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'pin-input-slot',
				class: cn(
					'border-border aria-invalid:border-destructive dark:bg-border/30 relative flex size-9 items-center justify-center border-y border-e text-sm transition-all outline-none first:rounded-s-md first:border-s last:rounded-e-md',
					cell.isActive &&
						'border-ring ring-ring/50 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 ring-offset-background z-10 ring-[3px]',
				),
			},
			restProps,
			cellState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{cell.char}
		{#if cell.hasFakeCaret}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
			</div>
		{/if}
	</div>
{/if}
