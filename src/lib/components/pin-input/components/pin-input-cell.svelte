<script lang="ts">
	import { join } from 'overrule';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PinInputCellProps } from '../types.js';
	import { PinInputCellState } from '../pin-input.svelte.js';
	import { createId } from '../../../internal/create-id.js';

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
				class: join(
					'relative grid size-9 place-items-center border-y border-e border-border text-sm transition-all outline-none first:rounded-s-md first:border-s last:rounded-e-md aria-invalid:border-destructive dark:bg-border/30',
					cell.isActive &&
						'z-10 border-ring ring-3 ring-ring/50 ring-offset-background aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
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
			<div class="pointer-events-none absolute inset-0 grid place-items-center">
				<div class="animate-caret-blink bg-foreground h-4 w-px"></div>
			</div>
		{/if}
	</div>
{/if}
