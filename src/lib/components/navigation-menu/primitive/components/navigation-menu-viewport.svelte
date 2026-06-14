<script lang="ts">
	import type { NavigationMenuViewportProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuViewportState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";
	import { mergeProps } from "$lib/vendor/index";
	import { Mounted } from "$lib/components/_shared/utilities/index";

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
