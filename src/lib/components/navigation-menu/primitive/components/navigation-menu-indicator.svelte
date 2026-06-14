<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuIndicatorProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuIndicatorState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import NavigationMenuIndicatorImpl from "$lib/components/navigation-menu/primitive/components/navigation-menu-indicator-impl.svelte";
	import { createId } from "$lib/vendor/create-id";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";
	import Portal from "$lib/components/_shared/utilities/portal/portal.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = NavigationMenuIndicatorState.create();
	const mergedProps = $derived(mergeProps(restProps));
</script>

{#if indicatorState.context.indicatorTrackRef.current}
	<Portal to={indicatorState.context.indicatorTrackRef.current}>
		<PresenceLayer open={forceMount || indicatorState.isVisible} ref={{ get current() { return ref; } }}>
			{#snippet presence({ transitionStatus })}
				<NavigationMenuIndicatorImpl
					{...mergeProps(mergedProps, { "data-starting-style": transitionStatus === "starting" ? "" : undefined, "data-ending-style": transitionStatus === "ending" ? "" : undefined })}
					{children}
					{child}
					{id}
					bind:ref
				/>
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
