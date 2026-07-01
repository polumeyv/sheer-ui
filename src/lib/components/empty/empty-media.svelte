<script lang="ts" module>
	import { join } from 'overrule';
	import { emptyMediaVariants, type EmptyMediaVariant } from './variants';
	export { emptyMediaVariants, type EmptyMediaVariant };
</script>

<script lang="ts">
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = 'default',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: EmptyMediaVariant } = $props();
</script>

<div bind:this={ref} data-slot="empty-icon" data-variant={variant} class={join(emptyMediaVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</div>
