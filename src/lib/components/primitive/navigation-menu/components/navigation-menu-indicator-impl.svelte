<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { NavigationMenuIndicatorProps } from "$lib/components/primitive/navigation-menu/index";
	import { NavigationMenuIndicatorImplState } from "$lib/components/primitive/navigation-menu/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = NavigationMenuIndicatorImplState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, indicatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
