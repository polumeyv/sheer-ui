<script lang="ts">
	import type { PopoverRootProps } from '../types.js';
	import { PopoverRootState } from '../popover.svelte.js';
	import { OpenCell } from '../../../internal/open-cell.svelte.js';

	let { open = false, onOpenChangeComplete = () => {}, state, children }: PopoverRootProps = $props();

	// Root owns both the machinery and the cell; `open` (the prop) is the cell's
	// derivation source, and the children snippet is the only way the cell leaves.
	// A caller-built `state` cell (with its own source/writer) takes over both roles.
	// The cell's identity is fixed at mount — swapping `state` later is not supported.
	// svelte-ignore state_referenced_locally
	const popover = state ?? new OpenCell(() => open);
	PopoverRootState.create({
		get open() {
			return popover.open;
		},
		set open(value) {
			popover.open = value;
		},
		get onOpenChangeComplete() {
			return onOpenChangeComplete;
		},
	});
</script>

{@render children?.(popover)}
