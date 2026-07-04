<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuItemProps } from '../types.js';
	import { MenuItemState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		onSelect = () => {},
		closeOnSelect = true,
		inset,
		variant = 'default',
		...restProps
	}: MenuItemProps & {
		inset?: boolean;
		variant?: 'default' | 'destructive';
	} = $props();

	const itemState = MenuItemState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => onSelect),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		closeOnSelect: boxWith(() => closeOnSelect),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-item',
				'data-inset': inset,
				'data-variant': variant,
				class:
					"data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-[variant=destructive]:data-highlighted:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			itemState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
