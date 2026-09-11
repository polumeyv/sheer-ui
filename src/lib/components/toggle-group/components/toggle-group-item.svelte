<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ToggleGroupItemProps } from '../types.js';
	import { createToggleGroupItem } from '../toggle-group.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { getToggleGroupCtx } from './toggle-group.svelte';
	import { toggleVariants, type ToggleSize, type ToggleVariant } from '../../toggle/variants.js';

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		disabled = false,
		id = createId(uid),
		type = 'button',
		size,
		variant,
		...restProps
	}: ToggleGroupItemProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();

	const ctx = getToggleGroupCtx();

	const itemState = createToggleGroupItem({
		get id() {
			return id;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled ?? false;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toggle-group-item',
				'data-variant': ctx.variant || variant,
				'data-size': ctx.size || size,
				'data-spacing': ctx.spacing,
				class: toggleVariants({
					variant: ctx.variant || variant,
					size: ctx.size || size,
					class:
						'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10 data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
				}),
			},
			restProps,
			itemState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
