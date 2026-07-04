<script lang="ts">
	import { join } from 'overrule';
	import MobileSurface from './sidebar-mobile-surface.svelte';
	import DesktopSurface from './sidebar-desktop-surface.svelte';
	import { useSidebar } from './context.svelte.js';
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

	const sidebar = useSidebar();
</script>

{#if collapsible === 'none'}
	<div
		class={join('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className)}
		bind:this={ref}
		{...restProps}>
		{@render children?.()}
	</div>
{:else if sidebar.isMobile}
	<MobileSurface bind:ref {side} class={className} {children} {...restProps} />
{:else}
	<DesktopSurface bind:ref {side} {variant} {collapsible} class={className} {children} {...restProps} />
{/if}
