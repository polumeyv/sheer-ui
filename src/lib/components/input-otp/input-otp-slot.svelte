<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { PinInputCellProps } from '$lib/components/pin-input/index';
	import { PinInputCellState } from '$lib/components/pin-input/pin-input.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		cell,
		child,
		children,
		class: className,
		...restProps
	}: PinInputCellProps = $props();

	const cellState = PinInputCellState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		cell: { get current() { return cell; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'input-otp-slot',
				class: cn(
					'border-input aria-invalid:border-destructive dark:bg-input/30 relative flex size-9 items-center justify-center border-y border-e text-sm transition-all outline-none first:rounded-s-md first:border-s last:rounded-e-md',
					cell.isActive &&
						'border-ring ring-ring/50 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 ring-offset-background z-10 ring-[3px]',
					className
				),
			},
			restProps,
			cellState.props
		)
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
