<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogOverlayState } from '../dialog.svelte.js';
	import type { DialogOverlayProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import { PresenceManager } from '../../../internal/presence-manager.svelte.js';

	const uid = $props.id();

	let { id = createId(uid), forceMount = false, child, children, ref = $bindable(null), ...restProps }: DialogOverlayProps = $props();

	const overlayState = DialogOverlayState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// Same shouldRender-timed mount gate as dialog-content-headless (see the note there).
	const presence = new PresenceManager({
		ref: boxWith(() => ref),
		open: boxWith(() => overlayState.root.cell.open),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

{#if presence.shouldRender || forceMount}
	{#if child}
		{@render child({ props: mergeProps(mergedProps), ...overlayState.snippetProps })}
	{:else}
		<div {...mergeProps(mergedProps)}>
			{@render children?.(overlayState.snippetProps)}
		</div>
	{/if}
{/if}
