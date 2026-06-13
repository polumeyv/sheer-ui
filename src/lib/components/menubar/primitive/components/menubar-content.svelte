<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { MenubarContentProps } from "$lib/components/menubar/primitive/index.js";
	import { MenubarContentState } from "$lib/components/menubar/primitive/menubar.svelte.js";
	import MenuContent from "$lib/components/_shared/menu/components/menu-content.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = createId(uid),
		onInteractOutside = (() => {}),
		onFocusOutside = (() => {}),
		onCloseAutoFocus = (() => {}),
		onOpenAutoFocus = (() => {}),
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

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
