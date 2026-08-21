<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { mergeProps } from '../../../internal/merge-props.js';

	import type { NavigationMenuIndicatorProps } from '../types.js';
	import { NavigationMenuIndicatorState } from '../navigation-menu.svelte.js';
	import NavigationMenuIndicatorImpl from './navigation-menu-indicator-impl.svelte';

	import Portal from '../../../internal/portal/portal.svelte';

	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		children,
		child,
		...restProps
	}: NavigationMenuIndicatorProps & {
		class?: ClassValue;
	} = $props();

	const indicatorState = NavigationMenuIndicatorState.create();

	const indicatorClass = $derived(
		join(
			'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden transition-[opacity,display] transition-discrete data-[state=hidden]:opacity-0 data-[state=hidden]:hidden starting:data-[state=visible]:opacity-0',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(restProps, {
			'data-slot': 'navigation-menu-indicator',
			class: indicatorClass,
		}),
	);
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<NavigationMenuIndicatorImpl {...mergedProps} {id} bind:ref {child}>
			{#snippet children()}
				{#if children}
					{@render children()}
				{:else}
					<div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
				{/if}
			{/snippet}
		</NavigationMenuIndicatorImpl>
	</Portal>
{/if}
