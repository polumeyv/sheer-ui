<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuLinkProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuLinkState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = (() => {}),
		tabindex = 0,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = NavigationMenuLinkState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		active: { get current() { return active; } },
		onSelect: { get current() { return onSelect; } },
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
