<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { NavigationMenuLinkProps } from '$lib/components/navigation-menu/primitive/index';
	import { NavigationMenuLinkState } from '$lib/components/navigation-menu/primitive/navigation-menu.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = (() => {}),
		tabindex = 0,
		class: className,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = NavigationMenuLinkState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		active: { get current() { return active; } },
		onSelect: { get current() { return onSelect; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-link',
				class: cn(
					"data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-md p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
					className
				),
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
