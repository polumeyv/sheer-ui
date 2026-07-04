<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { join } from 'overrule';
	import type { WithElementRef } from '../../../utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="popover-title" class={join('font-medium', className)} {...restProps}>
	{@render children?.()}
</div>
