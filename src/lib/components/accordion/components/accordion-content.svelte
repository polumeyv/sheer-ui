<script lang="ts">
	import { join } from 'overrule';
	import type { AccordionContentProps } from '../types.js';

	let { class: className, ref = $bindable(null), children, ...restProps }: AccordionContentProps = $props();
</script>

<div {...restProps} data-slot="accordion-content" class="text-sm" bind:this={ref}>
	<div class={join('pt-0 pb-4', className)}>
		{@render children?.()}
	</div>
</div>
