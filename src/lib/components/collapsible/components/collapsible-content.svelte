<script lang="ts">
	import type { CollapsibleContentProps } from '../types.js';

	let { ref = $bindable(null), children, ...restProps }: CollapsibleContentProps = $props();
</script>

<!-- The slot is the animated grid; its single bare child collapses via min-height 0. Consumer
     classes (padding included) go one level deeper — padding on the grid container or the
     collapsing child would floor the closed track at the padding height. -->
<div data-slot="collapsible-content" bind:this={ref}>
	<div>
		<div {...restProps}>
			{@render children?.()}
		</div>
	</div>
</div>
