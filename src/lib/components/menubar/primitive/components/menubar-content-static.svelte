<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenubarContentStaticProps } from "$lib/components/menubar/primitive/index.js";
	import { MenubarContentState } from "$lib/components/menubar/primitive/menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import MenuContentStatic from "$lib/components/_shared/menu/components/menu-content-static.svelte";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = "close",
		id = createId(uid),
		onInteractOutside = (() => {}),
		onCloseAutoFocus = (() => {}),
		onFocusOutside = (() => {}),
		onOpenAutoFocus = (() => {}),
		...restProps
	}: MenubarContentStaticProps = $props();

	const contentState = MenubarContentState.create({
		id: { get current() { return id; } },
		interactOutsideBehavior: { get current() { return interactOutsideBehavior; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		onInteractOutside: { get current() { return onInteractOutside; } },
		onFocusOutside: { get current() { return onFocusOutside; } },
		onCloseAutoFocus: { get current() { return onCloseAutoFocus; } },
		onOpenAutoFocus: { get current() { return onOpenAutoFocus; } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<MenuContentStatic bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
