<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();
</script>

<thead bind:this={ref} data-slot="table-header" class={join('[&_tr]:border-b', className)} {...restProps}>
	{@render children?.()}
</thead>
