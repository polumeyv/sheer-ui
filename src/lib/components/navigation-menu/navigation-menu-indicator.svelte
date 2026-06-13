<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { NavigationMenuIndicatorProps } from '$lib/bits/navigation-menu/types.js';
	import { NavigationMenuIndicatorState } from '$lib/bits/navigation-menu/navigation-menu.svelte.js';
	import NavigationMenuIndicatorImpl from '$lib/bits/navigation-menu/components/navigation-menu-indicator-impl.svelte';
	import { createId } from '$lib/internal/create-id.js';
	import { getDataTransitionAttrs } from '$lib/internal/attrs.js';
	import PresenceLayer from '$lib/bits/utilities/presence-layer/presence-layer.svelte';
	import Portal from '$lib/bits/utilities/portal/portal.svelte';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		class: className,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = NavigationMenuIndicatorState.create();
	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-indicator',
				class: cn(
					'transition-opacity starting:opacity-0 data-[state=hidden]:opacity-0 top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
					className
				),
			},
			restProps
		)
	);
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<PresenceLayer open={forceMount || indicatorState.isVisible} ref={boxWith(() => ref)}>
			{#snippet presence({ transitionStatus })}
				<NavigationMenuIndicatorImpl
					{...mergeProps(mergedProps, getDataTransitionAttrs(transitionStatus))}
					{child}
					{id}
					bind:ref
				>
					<div class="bg-border rounded-ts-sm relative top-[60%] h-2 w-2 rotate-45 shadow-md"></div>
				</NavigationMenuIndicatorImpl>
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
