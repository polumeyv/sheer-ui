<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { CommandLinkItemProps } from '$lib/bits/command/types.js';
	import { CommandItemState } from '$lib/bits/command/command.svelte.js';
	import { noop } from '$lib/internal/noop.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = '',
		disabled = false,
		children,
		child,
		onSelect = noop,
		forceMount = false,
		keywords = [],
		class: className,
		...restProps
	}: CommandLinkItemProps = $props();

	const itemState = CommandItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
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
				class: cn(
					"aria-selected:bg-accent aria-selected:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
					className
				),
			},
			restProps,
			itemState.props
		)
	);
</script>

{#key itemState.root.key}
	<div style="display: contents;">
		{#if itemState.shouldRender}
			{#if child}
				{@render child({ props: mergedProps })}
			{:else}
				<a {...mergedProps}>
					{@render children?.()}
				</a>
			{/if}
		{/if}
	</div>
{/key}
