<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';

	import type { NavigationMenuRootProps } from '../types.js';
	import { NavigationMenuRootState } from '../navigation-menu.svelte.js';

	import NavigationMenuViewport from './navigation-menu-viewport.svelte';

	import { createId } from '../../../internal/create-id.js';

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
		class?: ClassValue;
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

	const rootClass = $derived(join('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className));

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
