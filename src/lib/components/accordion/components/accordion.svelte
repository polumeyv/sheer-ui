<script lang="ts">
	import { AccordionState, setAccordion } from '../accordion.svelte.js';
	import type { AccordionRootProps } from '../types.js';

	let {
		type = 'single',
		value = $bindable(type === 'single' ? '' : []),
		ref = $bindable(null),
		children,
		...restProps
	}: AccordionRootProps = $props();

	setAccordion(
		new AccordionState({
			type: () => type,
			value: () => value ?? (type === 'single' ? '' : []),
			setValue: (v) => (value = v),
		}),
	);
</script>

<div data-slot="accordion" bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
