<script lang="ts">
	import { join } from 'overrule';
	import { useAccordion } from '../accordion.svelte.js';
	import type { AccordionItemProps } from '../types.js';

	let { value, disabled = false, class: className, ref = $bindable(null), children, ...restProps }: AccordionItemProps = $props();

	const accordion = useAccordion();
</script>

<details
	{...restProps}
	data-slot="accordion-item"
	class={join('border-b last:border-b-0', disabled && 'pointer-events-none opacity-50', className)}
	name={accordion.name}
	open={accordion.includes(value)}
	inert={disabled || undefined}
	ontoggle={(e) => accordion.report(value, e.currentTarget.open)}
	bind:this={ref}>
	{@render children?.()}
</details>
