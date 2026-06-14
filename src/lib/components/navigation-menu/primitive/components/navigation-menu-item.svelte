<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuItemProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuItemState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		value: { get current() { return value; } },
		openOnHover: { get current() { return openOnHover; } },
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
