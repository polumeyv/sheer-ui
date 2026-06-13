<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/index.js";
	import type { NavigationMenuItemProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuItemState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		value = defaultId,
		ref = $bindable(null),
		child,
		children,
		openOnHover = true,
		...restProps
	}: NavigationMenuItemProps = $props();

	const itemState = NavigationMenuItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		openOnHover: boxWith(() => openOnHover),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<li {...mergedProps}>
		{@render children?.()}
	</li>
{/if}
