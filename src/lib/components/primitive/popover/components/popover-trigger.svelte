<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { PopoverTriggerProps } from "$lib/components/primitive/popover/index";
	import { PopoverTriggerState } from "$lib/components/primitive/popover/popover.svelte";
	import { createId } from "$lib/vendor/create-id";
	import FloatingLayerAnchor from "$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		type = "button",
		disabled = false,
		openOnHover = false,
		openDelay = 700,
		closeDelay = 300,
		...restProps
	}: PopoverTriggerProps = $props();

	const triggerState = PopoverTriggerState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
		openOnHover: { get current() { return openOnHover; } },
		openDelay: { get current() { return openDelay; } },
		closeDelay: { get current() { return closeDelay; } },
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
