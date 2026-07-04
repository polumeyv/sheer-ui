<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="heading"
	class={join(
		'w-full has-data-[slot=heading-nav]:mb-6',
		'[&:not(:has([data-slot=heading-nav]))]:mb-2 [&:not(:has([data-slot=heading-nav]))]:md:mb-4 [&:not(:has([data-slot=heading-nav]))]:lg:mb-6',
		className,
	)}
	{...restProps}>
	{@render children?.()}
</div>
