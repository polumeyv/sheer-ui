<script lang="ts">
	import { AccordionState, setAccordion } from '../accordion.svelte.js';
	import type { AccordionRootProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		type = 'single',
		value = $bindable(type === 'single' ? '' : []),
		ref = $bindable(null),
		children,
		...restProps
	}: AccordionRootProps = $props();

	setAccordion(
		new AccordionState(
			{
				type: () => type,
				value: () => value ?? (type === 'single' ? '' : []),
				setValue: (v) => (value = v),
			},
			createId(uid),
		),
	);
</script>

<div data-slot="accordion" bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
