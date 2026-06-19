<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { NavigationMenuIndicatorProps } from "../types.js";
	import { NavigationMenuIndicatorState } from "../navigation-menu.svelte.js";
	import NavigationMenuIndicatorImpl from "./navigation-menu-indicator-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { getDataTransitionAttrs } from "$lib/internal/attrs.js";
	import PresenceLayer from "$lib/components/utilities/presence-layer/presence-layer.svelte";
	import Portal from "$lib/components/utilities/portal/portal.svelte";

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
	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "navigation-menu-indicator",
				class: "transition-opacity starting:opacity-0 data-[state=hidden]:opacity-0 top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
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
					<div
						class="bg-border rounded-ts-sm relative top-[60%] h-2 w-2 rotate-45 shadow-md"
					></div>
				</NavigationMenuIndicatorImpl>
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
