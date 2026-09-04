<script lang="ts">
	import { join } from 'overrule';
	import { panelDisplayed, useSidebar } from './context.svelte.js';
	import { resizeAttachment } from '../../internal/svelte-resize-observer.svelte.js';
	import type { SidebarRootProps } from './types.js';
	import type { Attachment } from 'svelte/attachments';

	let {
		ref = $bindable(null),
		side = 'left',
		variant = 'sidebar',
		collapsible = 'offcanvas',
		class: className,
		children,
		sheetBody = null,
		sheetDialog = null,
		...restProps
	}: SidebarRootProps & {
		/** This Root's sheet, bound by the Root: where the content goes while CSS hides this panel. */
		sheetBody?: HTMLElement | null;
		sheetDialog?: HTMLDialogElement | null;
	} = $props();

	const sidebar = useSidebar();

	let container: HTMLElement;
	let inner: HTMLElement;

	// The content tree renders once, here, server-side always here, and lives in whichever
	// surface CSS displays: this panel's own display (not an ancestor's) is the viewport.
	const rehome = (panel: HTMLElement) => {
		const displayed = panelDisplayed(panel);
		const home = displayed ? container : sheetBody;
		// append() re-inserts even in place, which would blur focus and restart transitions.
		if (home && inner.parentNode !== home) home.append(inner);
		if (!displayed) return;
		// A sheet left open at the crossing goes the way it did when the surface unmounted:
		// closed this frame, no exit slide, the page interactive at once. Routing through state
		// would keep the page inert behind an empty sheet for the 300ms exit.
		if (sheetDialog?.open) sheetDialog.close();
		sidebar.closeSheet();
	};

	// The observer fires when `hidden md:block` flips this box between 0×0 and laid out, which is
	// the breakpoint crossing.
	const observe = resizeAttachment(([entry]) => entry && rehome(entry.target as HTMLElement));
	const register: Attachment<HTMLElement> = (node) => {
		sidebar.desktopPanels.add(node);
		return () => sidebar.desktopPanels.delete(node);
	};
	// A crossing made while an ancestor is display:none reports no size change (0×0 either way), so
	// the content can be parked in the wrong surface while nothing shows it; the sheet opening is
	// the moment that matters, and re-homes.
	$effect(() => {
		if (sidebar.sheetOpen && ref) rehome(ref);
	});
</script>

<div
	bind:this={ref}
	{@attach register}
	{...observe}
	class="text-sidebar-foreground group peer hidden md:block"
	data-state={sidebar.open ? 'expanded' : 'collapsed'}
	data-collapsible={sidebar.open ? '' : collapsible}
	data-variant={variant}
	data-side={side}
	data-slot="sidebar">
	<!-- This is what handles the sidebar gap on desktop -->
	<div
		data-slot="sidebar-gap"
		class={join(
			'transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent',
			'group-data-[collapsible=offcanvas]:w-0',
			'group-data-[side=right]:rotate-180',
			variant === 'floating' || variant === 'inset'
				? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
				: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
		)}>
	</div>
	<div
		bind:this={container}
		data-slot="sidebar-container"
		class={join(
			'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
			side === 'left'
				? 'inset-s-0 group-data-[collapsible=offcanvas]:-inset-s-(--sidebar-width)'
				: 'inset-e-0 group-data-[collapsible=offcanvas]:-inset-e-(--sidebar-width)',
			// Adjust the padding for floating and inset variants.
			variant === 'floating' || variant === 'inset'
				? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
				: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s',
			className,
		)}
		{...restProps}>
		<div
			bind:this={inner}
			data-sidebar="sidebar"
			data-slot="sidebar-inner"
			class="bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col">
			{@render children?.()}
		</div>
	</div>
</div>
