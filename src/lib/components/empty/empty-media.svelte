<script lang="ts" module>
	import { emptyMediaVariants, type EmptyMediaVariant } from './variants';
	export { emptyMediaVariants, type EmptyMediaVariant };
</script>

<script lang="ts">
	import type { WithElementRef } from '../../utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = 'default',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: EmptyMediaVariant } = $props();
</script>

<div bind:this={ref} data-slot="empty-icon" data-variant={variant} class={emptyMediaVariants({ variant, class: className })} {...restProps}>
	{@render children?.()}
</div>
