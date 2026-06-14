<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { NavigationMenuRootProps } from '$lib/components/primitive/navigation-menu/index';
	import { NavigationMenuRootState } from '$lib/components/primitive/navigation-menu/navigation-menu.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';
	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = (() => {}),
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = 'ltr',
		orientation = 'horizontal',
		viewport = true,
		class: className,
		...restProps
	}: NavigationMenuRootProps & {
		viewport?: boolean;
	} = $props();

	const rootState = NavigationMenuRootState.create({
		id: { get current() { return id; } },
		value: { get current() { return value; }, set current(v) { value = v; onValueChange(v); } },
		delayDuration: { get current() { return delayDuration; } },
		skipDelayDuration: { get current() { return skipDelayDuration; } },
		dir: { get current() { return dir; } },
		orientation: { get current() { return orientation; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-label': 'main',
				'data-slot': 'navigation-menu',
				'data-viewport': viewport,
				class: cn(
					'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
					className
				),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<nav {...mergedProps}>
		{@render children?.()}

		{#if viewport}
			<NavigationMenuViewport />
		{/if}
	</nav>
{/if}
