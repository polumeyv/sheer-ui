<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { NavigationMenuRootProps } from '../types.js';
	import { NavigationMenuRootState } from '../navigation-menu.svelte.js';

	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = () => {},
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = 'ltr',
		orientation = 'horizontal',
		viewport = true,
		class: className,
		...restProps
	}: NavigationMenuRootProps & {
		viewport?: boolean;
		class?: string;
	} = $props();

	const rootState = NavigationMenuRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			},
		),
		delayDuration: boxWith(() => delayDuration),
		skipDelayDuration: boxWith(() => skipDelayDuration),
		dir: boxWith(() => dir),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const rootClass = $derived(cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className));

	const mergedProps = $derived(
		mergeProps(
			{ 'aria-label': 'main' },
			restProps,
			{
				'data-slot': 'navigation-menu',
				'data-viewport': viewport,
				class: rootClass,
			},
			rootState.props,
		),
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
