<script lang="ts">
	import { box } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { noop } from '@polumeyv/utilities';
	import type { PaneGroupProps } from './types.js';
	import { defaultStorage, PaneGroupState } from './paneforge.svelte.js';

	const uid = $props.id();

	let {
		autoSaveId = null,
		direction,
		id = uid,
		keyboardResizeBy = null,
		onLayoutChange = noop,
		storage = defaultStorage,
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: PaneGroupProps = $props();

	const paneGroupState = PaneGroupState.create({
		id: box.with(() => id ?? uid),
		ref: box.with(
			() => ref,
			(v) => (ref = v),
		),
		autoSaveId: box.with(() => autoSaveId),
		direction: box.with(() => direction),
		keyboardResizeBy: box.with(() => keyboardResizeBy),
		onLayout: box.with(() => onLayoutChange),
		storage: box.with(() => storage),
	});

	export const getLayout = () => paneGroupState.layout;
	export const setLayout = paneGroupState.setLayout;
	export const getId = () => paneGroupState.opts.id.current;

	const mergedProps = $derived(mergeProps(restProps, paneGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
