<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { PopoverOverlayState } from "$lib/components/popover/primitive/popover.svelte.js";
	import type { PopoverOverlayProps } from "$lib/components/popover/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";

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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
