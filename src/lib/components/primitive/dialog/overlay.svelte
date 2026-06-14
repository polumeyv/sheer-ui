<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { DialogOverlayState } from '$lib/components/primitive/dialog/dialog.svelte';
	import type { DialogOverlayProps } from '$lib/components/primitive/dialog/index';
	import { createId } from '$lib/vendor/create-id';

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
		{@render child({ props: mergedProps, ...overlayState.snippetProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.(overlayState.snippetProps)}
		</div>
	{/if}
{/if}
