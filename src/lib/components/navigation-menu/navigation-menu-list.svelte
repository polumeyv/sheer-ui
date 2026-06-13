<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { NavigationMenuListProps } from '$lib/components/navigation-menu/primitive/types.js';
	import { NavigationMenuListState } from '$lib/components/navigation-menu/primitive/navigation-menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import Mounted from '$lib/components/_shared/utilities/mounted.svelte';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuListProps = $props();

	const listState = NavigationMenuListState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-list',
				class: cn('group flex flex-1 list-none items-center justify-center gap-1', className),
			},
			restProps,
			listState.props
		)
	);
	const wrapperProps = $derived(mergeProps(listState.wrapperProps));
</script>

{#if child}
	{@render child({ props: mergedProps, wrapperProps })}
	<Mounted bind:mounted={listState.wrapperMounted} />
{:else}
	<div {...wrapperProps}>
		<ul {...mergedProps}>
			{@render children?.()}
		</ul>
	</div>
	<Mounted bind:mounted={listState.wrapperMounted} />
{/if}
