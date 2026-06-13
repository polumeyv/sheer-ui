<script lang="ts">
	import { mergeProps } from '$lib/internal/merge-props.js';
	import type { ToggleGroupItemProps } from '$lib/components/toggle-group/primitive/index.js';
	import { ToggleGroupItemState } from '$lib/components/toggle-group/primitive/toggle-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { getToggleGroupCtx } from './toggle-group.svelte';
	import { cn } from '../../vendor/utils';
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
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value;
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
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
