<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ScrollAreaViewportProps } from '../types.js';
	import { ScrollAreaViewportState } from '../scroll-area.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { ref = $bindable(null), id = createId(uid), children, ...restProps }: ScrollAreaViewportProps = $props();

	const viewportState = ScrollAreaViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ class: 'scrollbar-hidden' }, restProps, viewportState.props));
	const mergedContentProps = $derived(mergeProps({}, viewportState.contentProps));
</script>

<div {...mergedProps}>
	<div {...mergedContentProps}>
		{@render children?.()}
	</div>
</div>

<style>
	:global(:where([data-scroll-area-viewport])) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	:global(:where([data-scroll-area-content])) {
		flex-grow: 1;
	}
</style>
