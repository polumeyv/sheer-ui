<script lang="ts">
	import type { NavigationMenuViewportProps } from '$lib/components/navigation-menu/primitive/index.js';
	import { NavigationMenuViewportState } from '$lib/components/navigation-menu/primitive/navigation-menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import PresenceLayer from '$lib/components/_shared/utilities/presence-layer/presence-layer.svelte';
	import { mergeProps } from '$lib/vendor/index.js';
	import { Mounted } from '$lib/components/_shared/utilities/index.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		child,
		children,
		class: className,
		...restProps
	}: NavigationMenuViewportProps = $props();

	const viewportState = NavigationMenuViewportState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-viewport',
				class: cn(
					'origin-top-center bg-popover text-popover-foreground transition-[scale] starting:scale-90 data-[state=closed]:scale-95 relative mt-1.5 h-[var(--bits-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--bits-navigation-menu-viewport-width)]',
					className
				),
			},
			restProps,
			viewportState.props
		)
	);
</script>

<div class={cn('absolute inset-s-0 top-full isolate z-50 flex justify-center')}>
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
</div>
