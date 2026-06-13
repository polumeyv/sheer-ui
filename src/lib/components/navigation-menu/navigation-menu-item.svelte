<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { NavigationMenuItemProps } from '$lib/components/navigation-menu/primitive/index.js';
	import { NavigationMenuItemState } from '$lib/components/navigation-menu/primitive/navigation-menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		value = defaultId,
		ref = $bindable(null),
		child,
		children,
		openOnHover = true,
		class: className,
		...restProps
	}: NavigationMenuItemProps = $props();

	const itemState = NavigationMenuItemState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; } },
		openOnHover: { get current() { return openOnHover; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'navigation-menu-item',
				class: cn('relative', className),
			},
			restProps,
			itemState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<li {...mergedProps}>
		{@render children?.()}
	</li>
{/if}
