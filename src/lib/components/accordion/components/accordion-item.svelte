<script lang="ts">
	import { join } from 'overrule';
	import { animationsSettled } from '../../../internal/disclosure-close.js';
	import { useAccordion } from '../accordion.svelte.js';
	import type { AccordionItemProps } from '../types.js';

	let { value, disabled = false, class: className, ref = $bindable(null), children, ...restProps }: AccordionItemProps = $props();

	const accordion = useAccordion();
	const open = $derived(accordion.includes(value));

	// `rendered` keeps the `open` attribute through the closing transition so the content
	// stays in the DOM while 1fr→0fr plays — including a sibling force-closed by the
	// single-type exclusivity; it drops once the subtree's animations settle.
	// svelte-ignore state_referenced_locally -- initial value only; later changes flow through the effect below.
	let rendered = $state(accordion.includes(value));
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
</script>

<details
	{...restProps}
	data-slot="accordion-item"
	data-state={open ? 'open' : 'closed'}
	class={join('border-b last:border-b-0', disabled && 'pointer-events-none opacity-50', className)}
	open={rendered}
	inert={disabled || undefined}
	onclick={(e) => {
		// Drive state from here instead of the native toggle, so a close (own or a
		// force-closed sibling) can animate before the browser unrenders the content.
		const summary = (e.target as HTMLElement).closest('summary');
		if (!summary || summary.closest('details') !== e.currentTarget) return;
		e.preventDefault();
		accordion.report(value, !open);
	}}
	ontoggle={(e) => {
		// Native toggles that bypass the click path (find-in-page, hash reveal).
		if (e.currentTarget.open === rendered) return;
		accordion.report(value, e.currentTarget.open);
	}}
	bind:this={ref}>
	{@render children?.()}
</details>
