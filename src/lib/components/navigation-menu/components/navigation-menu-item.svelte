<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { NavigationMenuItemProps } from '../types.js';
	import { NavigationMenuItemState } from '../navigation-menu.svelte.js';

	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		value = defaultId,
		ref = $bindable(null),
		class: className,
		child,
		children,
		openOnHover = true,
		...restProps
	}: NavigationMenuItemProps & {
		class?: ClassValue;
	} = $props();

	const itemState = NavigationMenuItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
		value: boxWith(() => value),
		openOnHover: boxWith(() => openOnHover),
	});

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'navigation-menu-item',
				class: join('relative', className),
			},
			itemState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<li {...mergedProps}>
		{@render children?.()}
	</li>
{/if}
