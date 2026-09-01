<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ContextMenuContentStaticProps } from '../types.js';
	import MenuContent from '../../menu/components/menu-content.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-layer/index.js';

	let { ref = $bindable(null), ...restProps }: ContextMenuContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'context-menu-content',
				class:
					'bg-popover text-popover-foreground popup-surface popup-surface-static z-50 min-w-32 origin-(--bits-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
				style: getFloatingContentCSSVars('context-menu'),
			},
			restProps,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} isStatic />
