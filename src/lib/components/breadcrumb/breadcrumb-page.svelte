<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="breadcrumb-page"
	role="link"
	aria-disabled="true"
	aria-current="page"
	class={join('text-foreground font-normal', className)}
	{...restProps}>
	{@render children?.()}
</span>
