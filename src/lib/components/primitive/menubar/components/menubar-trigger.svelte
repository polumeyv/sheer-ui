<script lang="ts">
	import { attachRef } from "$lib/vendor/index";
	import { mergeProps } from "$lib/merge-props";
	import type { MenubarTriggerProps } from "$lib/components/primitive/menubar/index";
	import { MenubarTriggerState } from "$lib/components/primitive/menubar/menubar.svelte";
	import { createId } from "$lib/vendor/create-id";
	import FloatingLayerAnchor from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { DropdownMenuTriggerState } from "$lib/components/_shared/menu/trigger.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: MenubarTriggerProps = $props();

	const triggerState = MenubarTriggerState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled ?? false; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const dropdownTriggerState = DropdownMenuTriggerState.create(triggerState.opts);
	const triggerAttachment = attachRef(
		(v: HTMLElement | null) => (dropdownTriggerState.parentMenu.triggerNode = v)
	);

	const mergedProps = $derived(
		mergeProps(restProps, triggerState.props, {
			...triggerAttachment,
		})
	);
</script>

<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
