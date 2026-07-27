<script lang="ts">
	import { animationsSettled } from '../../../internal/disclosure-close.js';
	import type { CollapsibleRootProps } from '../types.js';

	let {
		open = $bindable(false),
		disabled = false,
		onOpenChange = () => {},
		ref = $bindable(null),
		children,
		...restProps
	}: CollapsibleRootProps = $props();

	// `rendered` keeps the `open` attribute through the closing transition so the content
	// stays in the DOM while 1fr→0fr plays; it drops once the subtree's animations settle.
	let rendered = $state(open);
	let closeToken = 0;

	$effect.pre(() => {
		if (open) {
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
		if (next === open) return;
		open = next;
		onOpenChange(open);
	};
</script>

<details
	{...restProps}
	data-slot="collapsible"
	data-state={open ? 'open' : 'closed'}
	open={rendered}
	inert={disabled || undefined}
	onclick={(e) => {
		// Drive state from here instead of the native toggle, so closing can animate
		// before the browser unrenders the content.
		const summary = (e.target as HTMLElement).closest('summary');
		if (!summary || summary.closest('details') !== e.currentTarget) return;
		e.preventDefault();
		setOpen(!open);
	}}
	ontoggle={(e) => {
		// Native toggles that bypass the click path (find-in-page, hash reveal).
		if (e.currentTarget.open === rendered) return;
		setOpen(e.currentTarget.open);
	}}
	bind:this={ref}>
	{@render children?.()}
</details>
