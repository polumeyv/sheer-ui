<script lang="ts">
	import * as DialogPrimitive from "$lib/components/dialog/index.js";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";
	import { type WithChildren, box, mergeProps } from "svelte-toolbelt";
	import type { OverlayProps } from "./index.js";
	import { useId } from "../../internal/use-id.js";
	import { useDrawerOverlay } from "../../use-drawer-overlay.svelte.js";
	import Mounted from "../utils/mounted.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithoutChildrenOrChild<OverlayProps>> = $props();

	const overlayState = useDrawerOverlay({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

{#if overlayState.shouldRender}
	<DialogPrimitive.Overlay {...mergedProps}>
		<Mounted onMounted={overlayState.setMounted} />
		{@render children?.()}
	</DialogPrimitive.Overlay>
{/if}
