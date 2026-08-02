<script lang="ts">
	import { join } from 'overrule';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '../../internal/utils.js';
	import { getCarouselContext } from './carouselState.svelte';

	let { ref = $bindable(null), class: className, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const ctx = getCarouselContext();
</script>

<div bind:this={ref} data-slot="carousel-dots" class={join('flex justify-center gap-2', className)} {...restProps}>
	{#each ctx.scrollSnaps as _, i (i)}
		<button
			type="button"
			aria-label={`Go to slide ${i + 1}`}
			aria-current={i === ctx.selectedIndex ? 'true' : undefined}
			class="bg-muted-foreground/30 aria-[current]:bg-primary size-2 rounded-full transition-colors"
			onclick={() => ctx.scrollTo(i)}></button>
	{/each}
</div>
