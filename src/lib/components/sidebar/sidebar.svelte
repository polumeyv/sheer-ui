<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { isMobile } from '$lib/hooks/is-mobile.svelte';
	import MobileSurface from './sidebar-mobile-surface.svelte';
	import DesktopSurface from './sidebar-desktop-surface.svelte';
	import type { SidebarRootProps } from './types.js';

	let {
		ref = $bindable(null),
		side = 'left',
		variant = 'sidebar',
		collapsible = 'offcanvas',
		class: className,
		children,
		...restProps
	}: SidebarRootProps = $props();
</script>

{#if collapsible === 'none'}
	<div class={cn('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className)} bind:this={ref} {...restProps}>
		{@render children?.()}
	</div>
{:else if isMobile.current}
	<MobileSurface bind:ref {side} class={className} {children} {...restProps} />
{:else}
	<DesktopSurface bind:ref {side} {variant} {collapsible} class={className} {children} {...restProps} />
{/if}
