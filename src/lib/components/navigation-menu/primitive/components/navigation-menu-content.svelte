<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { NavigationMenuContentState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import NavigationMenuContentImpl from "$lib/components/navigation-menu/primitive/components/navigation-menu-content-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import type { NavigationMenuContentProps } from "$lib/components/navigation-menu/primitive/index.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
