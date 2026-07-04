<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} data-slot="card-content" class={join('px-6', className)} {...restProps}>
	{@render children?.()}
</div>
