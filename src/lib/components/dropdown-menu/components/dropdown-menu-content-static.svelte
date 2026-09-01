<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { DropdownMenuContentStaticProps } from '../types.js';
	import MenuContent from '../../menu/components/menu-content.svelte';
	import { getFloatingContentCSSVars } from '../../../internal/floating-svelte/floating-utils.svelte.js';

	let { ref = $bindable(null), ...restProps }: DropdownMenuContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-content',
				class:
					'bg-popover text-popover-foreground menu-surface menu-surface-static z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-32 origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none',
				style: getFloatingContentCSSVars('dropdown-menu'),
			},
			restProps,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} isStatic />
