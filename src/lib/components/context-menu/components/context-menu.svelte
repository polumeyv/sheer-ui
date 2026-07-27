<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { OpenCell } from '../../../internal/open-cell.svelte.js';
	import type { ContextMenuRootProps } from '../types.js';
	import FloatingLayer from '../../../internal/floating-layer/components/floating-layer.svelte';
	import { MenuMenuState, MenuRootState } from '../../menu/menu.svelte.js';

	let {
		open = false,
		dir = 'ltr',
		// debugMode = false,
		state: givenCell,
		onOpenChangeComplete = () => {},
		children,
	}: ContextMenuRootProps = $props();

	// Root owns both the machinery and the cell; `open` (the prop) is the cell's
	// derivation source, and the children snippet is the only way the cell leaves.
	// A caller-built `state` cell (with its own source/writer) takes over both roles.
	// The cell's identity is fixed at mount — swapping `state` later is not supported.
	// The engine keeps its boxed-open interface (vendored, ADR 0006); the box is a
	// bridge over the cell, so the cell stays the one owner of `open`.
	// svelte-ignore state_referenced_locally
	const menu = givenCell ?? new OpenCell(() => open);

	const root = MenuRootState.create({
		variant: boxWith(() => 'context-menu' as const),
		dir: boxWith(() => dir),
		// debugMode: boxWith(() => debugMode),
		onClose: () => (menu.open = false),
	});

	MenuMenuState.create(
		{
			open: boxWith(
				() => menu.open,
				(v) => (menu.open = v),
			),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		},
		root,
	);
</script>

<svelte:document
	onkeydowncapture={() => (root.isKeyboard = true)}
	onpointerdowncapture={() => (root.isKeyboard = false)}
/>

<FloatingLayer>
	{@render children?.(menu)}
</FloatingLayer>
