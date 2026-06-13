<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { NavigationMenuRootProps } from '$lib/bits/navigation-menu/types.js';
	import { NavigationMenuRootState } from '$lib/bits/navigation-menu/navigation-menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { cn } from '../../utils';
	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = noop,
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
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		delayDuration: boxWith(() => delayDuration),
		skipDelayDuration: boxWith(() => skipDelayDuration),
		dir: boxWith(() => dir),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
