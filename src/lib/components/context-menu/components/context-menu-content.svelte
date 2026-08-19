<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ContextMenuContentProps } from '../types.js';
	import MenuContent from '../../menu/components/menu-content.svelte';

	let { ref = $bindable(null), side = 'right', sideOffset = 2, align = 'start', trapFocus = false, ...restProps }: ContextMenuContentProps = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'context-menu-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 max-h-(--bits-floating-available-height) min-w-[8rem] origin-(--bits-floating-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
			},
			restProps,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} {side} {sideOffset} {align} {trapFocus} />
