<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith, mountedAttachment } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { NavigationMenuViewportProps } from '../types.js';
	import { NavigationMenuViewportState } from '../navigation-menu.svelte.js';

	import PresenceLayer from '$lib/components/utilities/presence-layer/presence-layer.svelte';

	import { createId } from '$lib/internal/create-id.js';
	import { getDataTransitionAttrs } from '$lib/internal/attrs.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		class: className,
		child,
		children,
		...restProps
	}: NavigationMenuViewportProps & {
		class?: ClassValue;
	} = $props();

	const viewportState = NavigationMenuViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const viewportClass = $derived(
		join(
			'origin-top-center relative mt-1.5 h-[calc(var(--bits-navigation-menu-viewport-height)+1rem)] w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-[calc(var(--bits-navigation-menu-viewport-width)+1rem)] data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-viewport',
				class: viewportClass,
			},
			viewportState.props,
		),
	);

	const mounted = mountedAttachment<HTMLElement>((m) => (viewportState.mounted = m));
</script>

<div class="absolute start-0 top-full isolate z-50 flex justify-center">
	<PresenceLayer open={forceMount || viewportState.open} ref={viewportState.opts.ref}>
		{#snippet presence({ transitionStatus })}
			{@const presenceProps = getDataTransitionAttrs(transitionStatus)}
			{@const finalProps = mergeProps(mergedProps, presenceProps, mounted)}

			{#if child}
				{@render child({ props: finalProps })}
			{:else}
				<div {...finalProps}>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
	</PresenceLayer>
</div>
