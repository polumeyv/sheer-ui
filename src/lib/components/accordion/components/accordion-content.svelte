<script lang="ts">
	import { join } from 'overrule';
	import type { AccordionContentProps } from '../types.js';

	let { class: className, ref = $bindable(null), children, ...restProps }: AccordionContentProps = $props();
</script>

<!-- The slot is the animated grid; its single bare child collapses via min-height 0. The padded
     div sits one level deeper — padding on the grid container or the collapsing child would
     floor the closed track at the padding height. -->
<div {...restProps} data-slot="accordion-content" class="text-sm" bind:this={ref}>
	<div>
		<div class={join('pt-0 pb-4', className)}>
			{@render children?.()}
		</div>
	</div>
</div>
