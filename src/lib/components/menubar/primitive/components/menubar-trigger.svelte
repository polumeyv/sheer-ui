<script lang="ts">
	import { attachRef, boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { MenubarTriggerProps } from "$lib/components/menubar/primitive/index.js";
	import { MenubarTriggerState } from "$lib/components/menubar/primitive/menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { DropdownMenuTriggerState } from "$lib/components/_shared/menu/menu.svelte.js";

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
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
