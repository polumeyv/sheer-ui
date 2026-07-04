<script lang="ts">
	import type { HTMLOptgroupAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../internal/utils.js';

	let { ref = $bindable(null), children, ...restProps }: WithElementRef<HTMLOptgroupAttributes> = $props();
</script>

<optgroup bind:this={ref} data-slot="select-opt-group" {...restProps}>
	{@render children?.()}
</optgroup>
