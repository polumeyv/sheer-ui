<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import type { MenuGroupHeadingProps } from '../types.js';
	import { MenuGroupHeadingState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		inset,
		...restProps
	}: MenuGroupHeadingProps & {
		inset?: boolean;
	} = $props();

	const groupHeadingState = MenuGroupHeadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});
	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-group-heading',
				'data-inset': inset,
				class: 'px-2 py-1.5 text-sm font-semibold data-[inset]:ps-8',
			},
			restProps,
			groupHeadingState.props,
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
