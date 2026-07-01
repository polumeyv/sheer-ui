<script lang="ts">
	import { cn } from '$lib/utils.js';
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

<div
	bind:this={ref}
	class="text-sidebar-foreground group peer hidden md:block"
	data-state={sidebar.state}
	data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
	data-variant={variant}
	data-side={side}
	data-slot="sidebar">
	<!-- This is what handles the sidebar gap on desktop -->
	<div
		data-slot="sidebar-gap"
		class={cn(
			'transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent',
			'group-data-[collapsible=offcanvas]:w-0',
			'group-data-[side=right]:rotate-180',
			variant === 'floating' || variant === 'inset'
				? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
				: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
		)}>
	</div>
	<div
		data-slot="sidebar-container"
		class={cn(
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
		<div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col">
			{@render children?.()}
		</div>
	</div>
</div>
