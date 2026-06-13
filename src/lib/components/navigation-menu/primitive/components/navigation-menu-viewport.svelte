<script lang="ts">
	import type { NavigationMenuViewportProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuViewportState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { Mounted } from "$lib/components/_shared/utilities/index.js";

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

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

<PresenceLayer open={forceMount || viewportState.open} ref={viewportState.opts.ref}>
	{#snippet presence({ transitionStatus })}
		{@const presenceProps = { "data-starting-style": transitionStatus === "starting" ? "" : undefined, "data-ending-style": transitionStatus === "ending" ? "" : undefined }}
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
