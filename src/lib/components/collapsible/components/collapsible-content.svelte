<script lang="ts">
	import type { CollapsibleContentProps } from '../types.js';

	let { ref = $bindable(null), children, ...restProps }: CollapsibleContentProps = $props();
</script>

<div {...restProps} data-slot="collapsible-content" bind:this={ref}>
	{@render children?.()}
</div>
