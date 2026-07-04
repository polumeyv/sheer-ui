<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();
</script>

<tbody bind:this={ref} data-slot="table-body" class={join('[&_tr:last-child]:border-0', className)} {...restProps}>
	{@render children?.()}
</tbody>
