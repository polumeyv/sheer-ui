<script lang="ts">
	import { join } from 'overrule';
	import type { WithElementRef, WithoutChildren } from '../../internal/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, ...restProps }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div bind:this={ref} data-slot="skeleton" class={join('bg-muted animate-pulse rounded-md', className)} {...restProps}></div>
