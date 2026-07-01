<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="item-actions" class={join('gap-2 flex items-center', className)} {...restProps}>
	{@render children?.()}
</div>
