<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { join } from 'overrule';
	import type { WithElementRef } from '../../internal/utils.js';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p bind:this={ref} data-slot="card-description" class={join('text-muted-foreground text-sm', className)} {...restProps}>
	{@render children?.()}
</p>
