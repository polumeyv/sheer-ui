<script lang="ts">
	import * as DialogPrimitive from '$lib/components/dialog/index.js';
	import { type WithChildren, box } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import { useId } from '$lib/internal/use-id.js';
	import { useDrawerOverlay } from './util/use-drawer-overlay.svelte.js';
	import type { OverlayProps } from './util/components/drawer/index.js';
	import Mounted from './util/components/utils/mounted.svelte';

	let {
		id = useId(),
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithChildren<WithoutChildrenOrChild<OverlayProps>> = $props();

	const overlayState = useDrawerOverlay({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'drawer-overlay',
				class: cn('fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=closed]:opacity-0 starting:opacity-0', className),
			},
			restProps,
			overlayState.props,
		),
	);
</script>

{#if overlayState.shouldRender}
	<DialogPrimitive.Overlay {...mergedProps}>
		<Mounted onMounted={overlayState.setMounted} />
		{@render children?.()}
	</DialogPrimitive.Overlay>
{/if}
