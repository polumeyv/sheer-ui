<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { CommandItemProps } from '../types.js';
	import { CommandItemState } from '../command.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = '',
		disabled = false,
		children,
		child,
		onSelect = () => {},
		forceMount = false,
		keywords = [],
		...restProps
	}: CommandItemProps = $props();

	const itemState = CommandItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => onSelect),
		forceMount: boxWith(() => forceMount),
		keywords: boxWith(() => keywords),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-item',
				class:
					"aria-selected:bg-accent aria-selected:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			itemState.props,
		),
	);
</script>

{#key itemState.root.key}
	<div style="display: contents;" data-item-wrapper data-value={itemState.trueValue}>
		{#if itemState.shouldRender}
			{#if child}
				{@render child({ props: mergedProps })}
			{:else}
				<div {...mergedProps}>
					{@render children?.()}
				</div>
			{/if}
		{/if}
	</div>
{/key}
