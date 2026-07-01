<script lang="ts">
	import * as Sheet from '../sheet/index.js';
	import { cn } from '$lib/utils.js';
	import { SIDEBAR_WIDTH_MOBILE } from './constants.js';
	import { useSidebar } from './context.svelte.js';
	import type { SidebarRootProps } from './types.js';

	let {
		ref = $bindable(null),
		side = 'left',
		class: className,
		children,
		...restProps
	}: SidebarRootProps = $props();

	const sidebar = useSidebar();
</script>

<Sheet.Root bind:open={() => sidebar.openMobile, (v) => sidebar.setOpenMobile(v)} {...restProps}>
	<Sheet.Content
		bind:ref
		data-sidebar="sidebar"
		data-slot="sidebar"
		data-mobile="true"
		class={cn('bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden', className)}
		style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
		{side}>
		<Sheet.Header class="sr-only">
			<Sheet.Title>Sidebar</Sheet.Title>
			<Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
		</Sheet.Header>
		<div class="flex h-full w-full flex-col">
			{@render children?.()}
		</div>
	</Sheet.Content>
</Sheet.Root>
