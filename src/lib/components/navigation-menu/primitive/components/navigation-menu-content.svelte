<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { NavigationMenuContentState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import NavigationMenuContentImpl from "$lib/components/navigation-menu/primitive/components/navigation-menu-content-impl.svelte";
	import { createId } from "$lib/vendor/create-id";
	import type { NavigationMenuContentProps } from "$lib/components/navigation-menu/primitive/index";
	import Portal from "$lib/components/_shared/utilities/portal/portal.svelte";
	import PresenceLayer from "$lib/components/_shared/utilities/presence-layer/presence-layer.svelte";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuContentProps = $props();

	const contentState = NavigationMenuContentState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
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
