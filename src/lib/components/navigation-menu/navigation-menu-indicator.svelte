<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { NavigationMenuIndicatorProps } from '$lib/components/primitive/navigation-menu/index';
	import { NavigationMenuIndicatorState } from '$lib/components/primitive/navigation-menu/navigation-menu.svelte';
	import NavigationMenuIndicatorImpl from '$lib/components/primitive/navigation-menu/components/navigation-menu-indicator-impl.svelte';
	import { createId } from '$lib/vendor/create-id';
	import PresenceLayer from '$lib/components/_shared/utilities/presence-layer/presence-layer.svelte';
	import Portal from '$lib/components/_shared/utilities/portal/portal.svelte';
	import { cn } from '../../vendor/utils';

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
		<PresenceLayer open={forceMount || indicatorState.isVisible} ref={{ get current() { return ref; } }}>
			{#snippet presence({ transitionStatus })}
				<NavigationMenuIndicatorImpl
					{...mergeProps(mergedProps, { "data-starting-style": transitionStatus === "starting" ? "" : undefined, "data-ending-style": transitionStatus === "ending" ? "" : undefined })}
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
