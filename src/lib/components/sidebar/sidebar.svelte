<script lang="ts">
	import { join } from 'overrule';
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

	// This Root's sheet, handed to its panel so several Roots in one Provider stay paired.
	let sheetBody = $state<HTMLElement | null>(null);
	let sheetDialog = $state<HTMLDialogElement | null>(null);
</script>

{#if collapsible === 'none'}
	<div
		class={join('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className)}
		bind:this={ref}
		{...restProps}>
		{@render children?.()}
	</div>
{:else}
	<!-- Both surfaces render on every viewport and server render alike; the sheet is a closed <dialog>
	     and the panel is `hidden md:block`, so CSS shows one and nothing swaps at hydration. The
	     content renders once, in the panel, which moves it into the sheet while CSS hides the panel.
	     `ref` is the panel; the sheet is reachable as [data-mobile]. -->
	<MobileSurface bind:ref={sheetDialog} bind:body={sheetBody} {side} class={className} />
	<DesktopSurface bind:ref {side} {variant} {collapsible} class={className} {children} {sheetBody} {sheetDialog} {...restProps} />
{/if}
