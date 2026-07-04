<script lang="ts">
	import { boxWith } from '../../tools/index.js';
	import { mergeProps } from '../../merge-props.js';
	import { noop } from '@polumeyv/utilities';
	import type { PaneProps } from './types.js';
	import { PaneState } from './paneforge.svelte.js';

	const uid = $props.id();

	let {
		id = uid,
		ref = $bindable(null),
		collapsedSize,
		collapsible,
		defaultSize,
		maxSize,
		minSize,
		onCollapse = noop,
		onExpand = noop,
		onResize = noop,
		order,
		child,
		children,
		...restProps
	}: PaneProps = $props();

	const paneState = PaneState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		collapsedSize: boxWith(() => collapsedSize),
		collapsible: boxWith(() => collapsible),
		defaultSize: boxWith(() => defaultSize),
		maxSize: boxWith(() => maxSize),
		minSize: boxWith(() => minSize),
		onCollapse: boxWith(() => onCollapse),
		onExpand: boxWith(() => onExpand),
		onResize: boxWith(() => onResize),
		order: boxWith(() => order),
	});

	export const collapse = paneState.pane.collapse;
	export const expand = paneState.pane.expand;
	export const getSize = paneState.pane.getSize;
	export const isCollapsed = paneState.pane.isCollapsed;
	export const isExpanded = paneState.pane.isExpanded;
	export const resize = paneState.pane.resize;
	export const getId = paneState.pane.getId;

	const mergedProps = $derived(mergeProps(restProps, paneState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
