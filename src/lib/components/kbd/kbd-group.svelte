<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<kbd bind:this={ref} data-slot="kbd-group" class={join('gap-1 inline-flex items-center', className)} {...restProps}>
	{@render children?.()}
</kbd>
