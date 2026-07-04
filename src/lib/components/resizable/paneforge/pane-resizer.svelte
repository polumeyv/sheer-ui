<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { noop } from '@polumeyv/utilities';
	import type { PaneResizerProps } from './types.js';
	import { PaneResizerState } from './paneforge.svelte.js';

	const uid = $props.id();

	let {
		id = uid,
		ref = $bindable(null),
		disabled = false,
		onDraggingChange = noop,
		tabindex = 0,
		child,
		children,
		...restProps
	}: PaneResizerProps = $props();

	const resizerState = PaneResizerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => disabled),
		onDraggingChange: boxWith(() => onDraggingChange),
		tabIndex: boxWith(() => tabindex),
	});

	const mergedProps = $derived(mergeProps(restProps, resizerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
