<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { MenubarContentProps } from "../types.js";
	import { MenubarContentState } from "../menubar.svelte.js";
	import MenuCon$lib/components/menu/components/menu-content.sveltetent.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = createId(uid),
		sideOffset = 8,
		alignOffset = -4,
		align = "start",
		side = "bottom",
		onInteractOutside = () => {},
		onFocusOutside = () => {},
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		...restProps
	}: MenubarContentProps = $props();

	const contentState = MenubarContentState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onFocusOutside: boxWith(() => onFocusOutside),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContent
	bind:ref
	{...mergedProps}
	{...contentState.popperProps}
	{sideOffset}
	{alignOffset}
	{align}
	{side}
	preventScroll={false} />
