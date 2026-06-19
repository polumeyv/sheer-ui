<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { NavigationMenuLinkProps } from "../types.js";
	import { NavigationMenuLinkState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = () => {},
		tabindex = 0,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = NavigationMenuLinkState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		active: boxWith(() => active),
		onSelect: boxWith(() => onSelect),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "navigation-menu-link",
				class: "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-md p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			linkState.props,
			{ tabindex }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
