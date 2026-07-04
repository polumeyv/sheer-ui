<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props();
</script>

<tfoot
	bind:this={ref}
	data-slot="table-footer"
	class={join('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
	{...restProps}>
	{@render children?.()}
</tfoot>
