<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from "$lib/components/badge";
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		badge,
		title: titleText,
		subtitle,
		class: cls = '',
		center = false,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		children?: Snippet;
		badge?: string;
		title?: string;
		subtitle?: string;
		center?: boolean;
	} = $props();
</script>

<section class="px-4 py-24 sm:px-6 sm:py-32 {cls}" {...rest}>
	<div class="mx-auto w-full max-w-4xl {center ? 'text-center' : ''}">
		{#if badge || titleText || subtitle}
			<div class={center ? 'mb-0' : 'mb-12'}>
				{#if badge}<Badge variant="secondary" class="mb-4">{badge}</Badge>{/if}
				{#if titleText}<h2 class="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{@html titleText}</h2>{/if}
				{#if subtitle}<p class="mx-auto max-w-2xl text-muted-foreground">{subtitle}</p>{/if}
			</div>
		{/if}
		{@render children?.()}
	</div>
</section>
