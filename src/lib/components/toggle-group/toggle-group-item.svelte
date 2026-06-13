<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { ToggleGroupItemProps } from '$lib/bits/toggle-group/types.js';
	import { ToggleGroupItemState } from '$lib/bits/toggle-group/toggle-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { getToggleGroupCtx } from './toggle-group.svelte';
	import { cn } from '../../utils';
	import { type ToggleVariants, toggleVariants } from '../toggle';

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		disabled = false,
		id = createId(uid),
		type = 'button',
		class: className,
		size,
		variant,
		...restProps
	}: ToggleGroupItemProps & ToggleVariants = $props();

	const ctx = getToggleGroupCtx();

	const itemState = ToggleGroupItemState.create({
		id: boxWith(() => id),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toggle-group-item',
				'data-variant': ctx.variant || variant,
				'data-size': ctx.size || size,
				'data-spacing': ctx.spacing,
				class: cn(
					toggleVariants({
						variant: ctx.variant || variant,
						size: ctx.size || size,
					}),
					'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10 data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
					className
				),
			},
			restProps,
			itemState.props,
			{ type }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
