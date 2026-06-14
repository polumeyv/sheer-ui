<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenubarContentProps } from "$lib/components/primitive/menubar/index";
	import { MenubarContentState } from "$lib/components/primitive/menubar/menubar.svelte";
	import MenuContent from "$lib/components/_shared/menu/components/menu-content.svelte";
	import { createId } from "$lib/vendor/create-id";

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

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} preventScroll={false} />
