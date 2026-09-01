<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { DropdownMenuContentProps } from '../types.js';
	import MenuContent from '../../menu/components/menu-content.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';

	let { ref = $bindable(null), sideOffset = 4, trapFocus = false, ...restProps }: DropdownMenuContentProps = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-content',
				class:
					'bg-popover text-popover-foreground menu-surface z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-32 origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none',
				style: getFloatingContentCSSVars('dropdown-menu'),
			},
			restProps,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} {sideOffset} {trapFocus} />
