<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import { DialogOverlayState } from '$lib/bits/dialog/dialog.svelte.js';
	import type { DialogOverlayProps } from '$lib/bits/dialog/types.js';
	import { createId } from '$lib/internal/create-id.js';

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
		{@render child({ props: mergedProps, ...overlayState.snippetProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.(overlayState.snippetProps)}
		</div>
	{/if}
{/if}
