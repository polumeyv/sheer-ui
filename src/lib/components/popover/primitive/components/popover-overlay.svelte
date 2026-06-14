<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { PopoverOverlayState } from "$lib/components/popover/primitive/popover.svelte";
	import type { PopoverOverlayProps } from "$lib/components/popover/primitive/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: PopoverOverlayProps = $props();

	const overlayState = PopoverOverlayState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

{#if overlayState.shouldRender || forceMount}
	{#if child}
		{@render child({ props: mergeProps(mergedProps), ...overlayState.snippetProps })}
	{:else}
		<div {...mergeProps(mergedProps)}>
			{@render children?.(overlayState.snippetProps)}
		</div>
	{/if}
{/if}
