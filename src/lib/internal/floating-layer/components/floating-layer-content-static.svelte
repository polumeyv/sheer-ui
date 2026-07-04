<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createAttachmentKey } from 'svelte/attachments';

	let {
		content,
		onPlaced,
	}: {
		content?: Snippet<[{ props: Record<string, unknown>; wrapperProps: Record<string, unknown> }]>;
		onPlaced?: () => void;
	} = $props();

	// Static content needs no positioning pass — it is "placed" as soon as the consumer's
	// element (which receives these props) hits the DOM. Hoisted so the attachment identity
	// is stable across renders.
	const placed = { [createAttachmentKey()]: () => onPlaced?.() };
</script>

{@render content?.({ props: placed, wrapperProps: {} })}
