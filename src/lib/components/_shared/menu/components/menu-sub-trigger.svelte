<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuSubTriggerProps } from "$lib/components/_shared/menu/index.js";
	import { MenuSubTriggerState } from "$lib/components/_shared/menu/menu.svelte.js";
	import FloatingLayerAnchor from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		ref = $bindable(null),
		children,
		child,
		onSelect = (() => {}),
		openDelay = 0,
		...restProps
	}: MenuSubTriggerProps = $props();

	const subTriggerState = MenuSubTriggerState.create({
		disabled: { get current() { return disabled; } },
		onSelect: { get current() { return onSelect; } },
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		openDelay: { get current() { return openDelay; } },
	});

	const mergedProps = $derived(mergeProps(restProps, subTriggerState.props));
</script>

<FloatingLayerAnchor {id} ref={subTriggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayerAnchor>
