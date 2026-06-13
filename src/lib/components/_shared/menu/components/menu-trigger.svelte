<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { MenuTriggerProps } from "$lib/components/_shared/menu/index.js";
	import { DropdownMenuTriggerState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import FloatingLayerAnchor from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		type = "button",
		...restProps
	}: MenuTriggerProps = $props();

	const triggerState = DropdownMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
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
