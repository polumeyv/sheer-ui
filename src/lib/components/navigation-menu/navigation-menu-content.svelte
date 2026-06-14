<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { NavigationMenuContentState } from '$lib/components/primitive/navigation-menu/navigation-menu.svelte';
	import NavigationMenuContentImpl from '$lib/components/primitive/navigation-menu/components/navigation-menu-content-impl.svelte';
	import { createId } from '$lib/vendor/create-id';
	import type { NavigationMenuContentProps } from '$lib/components/primitive/navigation-menu/index';
	import Portal from '$lib/components/_shared/utilities/portal/portal.svelte';
	import PresenceLayer from '$lib/components/_shared/utilities/presence-layer/presence-layer.svelte';
	import Mounted from '$lib/components/_shared/utilities/mounted.svelte';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		children,
		child,
		forceMount = false,
		class: className,
		...restProps
	}: NavigationMenuContentProps = $props();

	const contentState = NavigationMenuContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-content',
				class: cn(
					'transition-[opacity,scale,translate] data-[motion^=from-]:starting:opacity-0 data-[motion^=to-]:opacity-0 data-[motion=from-end]:starting:translate-x-52 data-[motion=from-start]:starting:-translate-x-52 data-[motion=to-end]:translate-x-52 data-[motion=to-start]:-translate-x-52 inset-s-0 top-0 w-full p-2 pe-2.5 md:absolute md:w-auto',
					'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:starting:opacity-0 group-data-[viewport=false]/navigation-menu:starting:scale-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:opacity-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:scale-95 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
					className
				),
			},
			restProps,
			contentState.props
		)
	);
</script>

<Portal
	to={contentState.context.viewportRef.current || undefined}
	disabled={!contentState.context.viewportRef.current}
>
	<PresenceLayer
		open={forceMount || contentState.open || contentState.isLastActiveValue}
		ref={contentState.opts.ref}
	>
		{#snippet presence({ transitionStatus })}
			<NavigationMenuContentImpl
				{...mergeProps(mergedProps, { "data-starting-style": transitionStatus === "starting" ? "" : undefined, "data-ending-style": transitionStatus === "ending" ? "" : undefined })}
				{children}
				{child}
			/>
			<Mounted bind:mounted={contentState.mounted} />
		{/snippet}
	</PresenceLayer>
</Portal>
