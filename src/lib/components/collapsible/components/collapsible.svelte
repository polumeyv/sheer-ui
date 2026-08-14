<script lang="ts">
	import { animationsSettled } from '../../../internal/use-open-change-complete.svelte.js';
	import { OpenCell } from '../../../internal/open-cell.svelte.js';
	import type { CollapsibleRootProps } from '../types.js';

	let {
		open = false,
		disabled = false,
		state: givenCell,
		ref = $bindable(null),
		children,
		...restProps
	}: CollapsibleRootProps = $props();

	// Cell over the source prop — locally-authored root, so the cell IS the state
	// (no vendored box to bridge). Interactions write it; the source prop re-derives it.
	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	// `rendered` keeps the `open` attribute through the closing transition so the content
	// stays in the DOM while 1fr→0fr plays; it drops once the subtree's animations settle.
	// svelte-ignore state_referenced_locally
	let rendered = $state(cell.open);
	let closeToken = 0;

	$effect.pre(() => {
		if (cell.open) {
			closeToken++;
			rendered = true;
			return;
		}
		if (!rendered) return;
		const token = ++closeToken;
		const el = ref;
		if (!el) {
			rendered = false;
			return;
		}
		void animationsSettled(el).then(() => {
			if (token === closeToken) rendered = false;
		});
	});

	const setOpen = (next: boolean) => {
		cell.open = next;
	};
</script>

<details
	{...restProps}
	data-slot="collapsible"
	data-state={cell.open ? 'open' : 'closed'}
	open={rendered}
	inert={disabled || undefined}
	onclick={(e) => {
		// Drive state from here instead of the native toggle, so closing can animate
		// before the browser unrenders the content.
		const summary = (e.target as HTMLElement).closest('summary');
		if (!summary || summary.closest('details') !== e.currentTarget) return;
		e.preventDefault();
		setOpen(!cell.open);
	}}
	ontoggle={(e) => {
		// Native toggles that bypass the click path (find-in-page, hash reveal).
		if (e.currentTarget.open === rendered) return;
		setOpen(e.currentTarget.open);
	}}
	bind:this={ref}>
	{@render children?.(cell)}
</details>
