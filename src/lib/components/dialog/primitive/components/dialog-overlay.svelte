<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { DialogOverlayState } from "$lib/components/dialog/primitive/dialog.svelte";
	import type { DialogOverlayProps } from "$lib/components/dialog/primitive/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: DialogOverlayProps = $props();

	const overlayState = DialogOverlayState.create({
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
