<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';

	import { NavigationMenuContentState } from '../navigation-menu.svelte.js';
	import NavigationMenuContentImpl from './navigation-menu-content-impl.svelte';

	import Portal from '../../../internal/portal/portal.svelte';
	import PresenceLayer from '../../../internal/presence-layer/presence-layer.svelte';

	import { createId } from '../../../internal/create-id.js';
	import { getDataTransitionAttrs } from '../../../internal/attrs.js';

	import type { NavigationMenuContentProps } from '../types.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		class: className,
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuContentProps & {
		class?: ClassValue;
	} = $props();

	const contentState = NavigationMenuContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const contentClass = $derived(
		join(
			'top-0 left-0 w-full p-2 pr-2.5 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 transition-[opacity,scale,translate] duration-150 starting:opacity-0 data-[motion=from-start]:starting:-translate-x-52 data-[motion=from-end]:starting:translate-x-52 data-[motion^=to-]:opacity-0 data-[motion=to-start]:-translate-x-52 data-[motion=to-end]:translate-x-52 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:starting:scale-95 group-data-[viewport=false]/navigation-menu:data-closed:opacity-0 group-data-[viewport=false]/navigation-menu:data-closed:scale-95',
			className,
		),
	);

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-content',
				class: contentClass,
			},
			contentState.props,
		),
	);
</script>

<Portal to={contentState.context.viewportRef.current || undefined} disabled={!contentState.context.viewportRef.current}>
	<PresenceLayer open={forceMount || contentState.open || contentState.isLastActiveValue} ref={contentState.opts.ref}>
		{#snippet presence({ transitionStatus })}
			<NavigationMenuContentImpl {...mergeProps(mergedProps, getDataTransitionAttrs(transitionStatus))} {children} {child} />
		{/snippet}
	</PresenceLayer>
</Portal>
