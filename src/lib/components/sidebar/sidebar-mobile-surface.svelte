<script lang="ts">
	import { untrack } from 'svelte';
	import * as Sheet from '../sheet/index.js';
	import { boxWith } from '../../internal/tools/index.js';
	import { DialogRootState, DialogState } from '../dialog/dialog.svelte.js';
	import { join } from 'overrule';
	import { SIDEBAR_WIDTH_MOBILE } from './constants.js';
	import { useSidebar } from './context.svelte.js';
	import type { SidebarRootProps } from './types.js';

	let { ref = $bindable(null), side = 'left', class: className, children }: SidebarRootProps = $props();

	const sidebar = useSidebar();

	// SidebarState is an external machine that owns `open`; the sheet cell
	// derives from it, and sheet-initiated dismissals route back through it.
	// This surface acts as its own sheet root so the cell stays internal.
	const sheetCell = new DialogState(() => sidebar.openForViewport);
	$effect(() => {
		const o = sheetCell.open;
		untrack(() => {
			if (o !== sidebar.openForViewport) sidebar.setOpen(o);
		});
	});

	DialogRootState.create({
		variant: boxWith(() => 'dialog'),
		cell: sheetCell,
		onOpenChangeComplete: boxWith(() => () => {}),
	});
</script>

	<Sheet.Content
		bind:ref
		data-sidebar="sidebar"
		data-slot="sidebar"
		data-mobile="true"
		class={join('bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden', className)}
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
