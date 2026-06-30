<script lang="ts">
	import { useFloating } from '../../src/lib/internal/floating-svelte/use-floating.svelte.js';
	import { simpleBox } from '../../src/lib/internal/tools/index.js';
	import type { FloatingElement, ReferenceElement } from '@floating-ui/dom';

	let {
		whileMounted = undefined,
	}: {
		whileMounted?: (reference: ReferenceElement, floating: FloatingElement, update: () => void) => () => void;
	} = $props();

	// Reactive options — the things the refactored `reset` / `trackWhileMountedDeps` arrows read.
	let open = $state(true);
	let sideOffset = $state(0);

	// Real elements, connected to the document so `isReferenceHidden` passes (getClientRects is stubbed in the test).
	const referenceEl = document.createElement('div');
	const floatingEl = document.createElement('div');
	document.body.append(referenceEl, floatingEl);

	const reference = simpleBox<HTMLElement | null>(referenceEl);

	// `whileMounted` is a static mount-time prop in these tests, so capturing it once is intended.
	// svelte-ignore state_referenced_locally
	const whileElementsMounted = whileMounted;

	const f = useFloating({
		open: () => open,
		reference,
		sideOffset: () => sideOffset,
		whileElementsMounted,
	});

	f.floating.current = floatingEl;

	export function setOpen(value: boolean) {
		open = value;
	}
	export function setSideOffset(value: number) {
		sideOffset = value;
	}
	export function clearFloating() {
		f.floating.current = null;
	}
	export function isPositionedNow() {
		return f.isPositioned;
	}
</script>
