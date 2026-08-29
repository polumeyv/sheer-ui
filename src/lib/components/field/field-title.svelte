<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="field-label"
	class={join('gap-2 text-sm font-medium group-data-disabled/field:opacity-50 flex w-fit items-center leading-5', className)}
	{...restProps}>
	{@render children?.()}
</div>
