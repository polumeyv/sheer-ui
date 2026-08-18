<script lang="ts">
	import { untrack } from 'svelte';
	import { AccordionState, setAccordion } from '../accordion.svelte.js';
	import { emptySelection } from '../../../internal/selection.svelte.js';
	import type { AccordionRootProps } from '../types.js';

	let {
		type = 'single',
		value = $bindable(emptySelection(type)),
		ref = $bindable(null),
		children,
		...restProps
	}: AccordionRootProps = $props();

	setAccordion(
		new AccordionState({
			type: untrack(() => type),
			value: () => value ?? emptySelection(type),
			setValue: (v) => (value = v),
		}),
	);
</script>

<div data-slot="accordion" bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
