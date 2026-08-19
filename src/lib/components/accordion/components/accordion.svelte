<script lang="ts">
	import { untrack } from 'svelte';
	import { repairBindable } from '../../../internal/tools/index.js';
	import { AccordionState, setAccordion } from '../accordion.svelte.js';
	import { emptySelection } from '../../../internal/selection.svelte.js';
	import type { AccordionRootProps } from '../types.js';

	let { type = 'single', value = $bindable(), ref = $bindable(null), children, ...restProps }: AccordionRootProps = $props();

	// Mode is fixed at construction; the value's shape follows it (string / string[]). Same
	// undefined repair as toggle-group and toolbar, so `bind:value` with an undefined parent
	// is legal and settles to the mode's empty selection.
	const valueType = untrack(() => type);

	repairBindable(
		() => value,
		() => {
			if (value === undefined) value = emptySelection(valueType);
		},
	);

	setAccordion(
		new AccordionState({
			type: valueType,
			value: () => value ?? emptySelection(valueType),
			setValue: (v) => (value = v),
		}),
	);
</script>

<div data-slot="accordion" bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
