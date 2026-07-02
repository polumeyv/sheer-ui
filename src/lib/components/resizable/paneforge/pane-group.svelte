<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
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
		id: boxWith(() => id ?? uid),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		autoSaveId: boxWith(() => autoSaveId),
		direction: boxWith(() => direction),
		keyboardResizeBy: boxWith(() => keyboardResizeBy),
		onLayout: boxWith(() => onLayoutChange),
		storage: boxWith(() => storage),
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
