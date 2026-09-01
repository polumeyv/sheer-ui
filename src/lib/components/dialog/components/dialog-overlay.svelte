<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogOverlayState } from '../dialog.svelte.js';
	import type { DialogOverlayProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), child, children, ref = $bindable(null), ...restProps }: DialogOverlayProps = $props();

	const overlayState = DialogOverlayState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// Always mounted; closed is visibility:hidden here, and the adapter's exit (the drawer's fadeOut
	// keyframe, the sheet's overlay-surface transition) holds it visible while it plays.
	const mergedProps = $derived(mergeProps(restProps, overlayState.props, { style: overlayState.root.cell.open ? {} : { visibility: 'hidden' } }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...overlayState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(overlayState.snippetProps)}
	</div>
{/if}
