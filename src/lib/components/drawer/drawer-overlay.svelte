<script lang="ts">
	import { join } from 'overrule';
	import * as DialogPrimitive from '$lib/components/dialog/index.js';
	import { type WithChildren, box, attachRef } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { WithoutChildrenOrChild } from '$lib/utils.js';
	import { useId } from '$lib/internal/use-id.js';
	import { getDrawer } from './util/context.js';
	import type { OverlayProps } from './util/components/drawer/index.js';

	let {
		id = useId(),
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithChildren<WithoutChildrenOrChild<OverlayProps>> = $props();

	const ctx = getDrawer();

	// The element is rendered by DialogPrimitive.Overlay; the attachment forwards
	// through to it, capturing the node straight into context on mount and clearing
	// it on unmount — no id lookup or mounted flag needed.
	const attachment = attachRef(
		box.with(
			() => ref,
			(v) => (ref = v),
		),
		(node) => ctx.setOverlayNode(node),
	);

	const hasSnapPoints = $derived(ctx.snapPoints.current && ctx.snapPoints.current.length > 0);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'drawer-overlay',
				class: join('fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=closed]:opacity-0 starting:opacity-0', className),
			},
			restProps,
			{
				id,
				onmouseup: ctx.onRelease,
				'data-vaul-overlay': '',
				'data-vaul-snap-points': ctx.open.current && hasSnapPoints ? 'true' : 'false',
				'data-vaul-snap-points-overlay': ctx.open.current && ctx.shouldFade ? 'true' : 'false',
				'data-vaul-animate': ctx.shouldAnimate ? 'true' : 'false',
			},
			attachment,
		),
	);
</script>

{#if ctx.modal.current}
	<DialogPrimitive.Overlay {...mergedProps}>
		{@render children?.()}
	</DialogPrimitive.Overlay>
{/if}
