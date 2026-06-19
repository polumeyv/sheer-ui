<script lang="ts">
	import type { NavigationMenuViewportProps } from "../types.js";
	import { NavigationMenuViewportState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDataTransitionAttrs } from "$lib/internal/attrs.js";
	import PresenceLayer from "$lib/components/utilities/presence-layer/presence-layer.svelte";
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import { Mounted } from "$lib/components/utilities/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		child,
		children,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = NavigationMenuViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "navigation-menu-viewport",
				class: "origin-top-center bg-popover text-popover-foreground transition-[scale] starting:scale-90 data-[state=closed]:scale-95 relative mt-1.5 h-[var(--bits-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--bits-navigation-menu-viewport-width)]",
			},
			restProps,
			viewportState.props
		)
	);
</script>

<div class="absolute inset-s-0 top-full isolate z-50 flex justify-center">
	<PresenceLayer open={forceMount || viewportState.open} ref={viewportState.opts.ref}>
		{#snippet presence({ transitionStatus })}
			{@const presenceProps = getDataTransitionAttrs(transitionStatus)}
			{#if child}
				{@render child({ props: mergeProps(mergedProps, presenceProps) })}
			{:else}
				<div {...mergeProps(mergedProps, presenceProps)}>
					{@render children?.()}
				</div>
			{/if}
			<Mounted bind:mounted={viewportState.mounted} />
		{/snippet}
	</PresenceLayer>
</div>
