<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="card-footer" class={join('flex items-center px-6 [.border-t]:pt-6', className)} {...restProps}>
	{@render children?.()}
</div>
