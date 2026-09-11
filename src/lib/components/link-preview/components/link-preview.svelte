<script lang="ts">
	import { OpenCell } from '../../../internal/open-cell.svelte.js';
	import type { LinkPreviewRootProps } from '../types.js';
	import { LinkPreviewRootState } from '../link-preview.svelte.js';

	let {
		disabled = false,
		open = false,
		state: givenCell,
		onOpenChangeComplete = () => {},
		openDelay = 700,
		closeDelay = 300,
		children,
	}: LinkPreviewRootProps = $props();

	// Cell over the source prop; the cell owns `open`, the engine reads and writes it through it.
	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	LinkPreviewRootState.create({
		get open() {
			return cell.open;
		},
		set open(v) {
			cell.open = v;
		},
		get disabled() {
			return disabled;
		},
		get openDelay() {
			return openDelay;
		},
		get closeDelay() {
			return closeDelay;
		},
		get onOpenChangeComplete() {
			return onOpenChangeComplete;
		},
	});
</script>

{@render children?.(cell)}
