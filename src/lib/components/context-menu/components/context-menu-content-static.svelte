<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ContextMenuContentStaticProps } from '../types.js';
	import MenuContent from '../../menu/components/menu-content.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';

	let { ref = $bindable(null), ...restProps }: ContextMenuContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'context-menu-content',
				class:
					'bg-popover text-popover-foreground transition-[opacity,scale,translate] starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[side=bottom]:starting:-translate-y-2 data-[side=top]:starting:translate-y-2 data-[side=left]:starting:translate-x-2 data-[side=right]:starting:-translate-x-2 z-50 max-h-(--bits-context-menu-content-available-height) min-w-32 origin-(--bits-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
				style: getFloatingContentCSSVars('context-menu'),
			},
			restProps,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} isStatic />
