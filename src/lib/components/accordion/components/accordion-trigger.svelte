<script lang="ts">
	import { join } from 'overrule';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import type { AccordionTriggerProps } from '../types.js';

	let { class: className, ref = $bindable(null), children, ...restProps }: AccordionTriggerProps = $props();

	// The one behavior <summary> lacks natively: APG arrow-key navigation between headers.
	function onkeydown(e: KeyboardEvent) {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
		const summary = e.currentTarget as HTMLElement;
		const root = summary.closest('[data-slot="accordion"]');
		if (!root) return;
		const triggers = [...root.querySelectorAll<HTMLElement>('summary[data-slot="accordion-trigger"]')];
		const index = triggers.indexOf(summary);
		if (index === -1) return;
		e.preventDefault();
		const next =
			e.key === 'Home' ? 0
			: e.key === 'End' ? triggers.length - 1
			: (index + (e.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
		triggers[next]?.focus();
	}
</script>

<summary
	{...restProps}
	data-slot="accordion-trigger"
	class={join(
		'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 cursor-pointer list-none items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 marker:hidden',
		className,
	)}
	{onkeydown}
	bind:this={ref}>
	{@render children?.()}
	<ChevronDownIcon
		class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 in-data-open:rotate-180" />
</summary>
