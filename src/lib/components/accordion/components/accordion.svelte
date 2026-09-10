<script lang="ts" module>
	import { createContext } from 'svelte';
	import { SelectionValue, emptySelection } from '../../../internal/selection.svelte.js';

	export const [useAccordion, setAccordion] = createContext<SelectionValue>();
</script>

<script lang="ts">
	import { repairBindable } from '../../../internal/tools/index.js';
	import type { AccordionRootProps } from '../types.js';

	let { type = 'single', value = $bindable(), ref = $bindable(null), children, ...restProps }: AccordionRootProps = $props();

	// Mode is fixed at mount, like the selection groups: `value` keeps the shape it was declared with.
	// svelte-ignore state_referenced_locally
	const valueType = type;

	repairBindable(
		() => value,
		() => {
			if (value === undefined) value = emptySelection(valueType);
		},
	);

	// Each item is a `<details>`; this holds the open set (bindable `value`) and single-type
	// exclusivity — not the native `name` attribute, which would unrender a force-closed sibling
	// before its closing transition can play. Items intercept summary clicks and report intent
	// here; the grid-track animation lives in ui.css.
	setAccordion(
		new SelectionValue(
			valueType,
			() => value ?? emptySelection(valueType),
			(v) => (value = v),
		),
	);
</script>

<div data-slot="accordion" bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
