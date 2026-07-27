<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
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

	// Cell over the source prop; the engine keeps its boxed-open interface (vendored,
	// ADR 0006) — the box is a bridge over the cell, so the cell owns `open`.
	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	LinkPreviewRootState.create({
		disabled: boxWith(() => disabled),
		open: boxWith(
			() => cell.open,
			(v) => (cell.open = v),
		),
		openDelay: boxWith(() => openDelay),
		closeDelay: boxWith(() => closeDelay),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.(cell)}
