<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { NavigationMenuListProps } from "$lib/components/navigation-menu/primitive/index";
	import { NavigationMenuListState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte";
	import { createId } from "$lib/vendor/create-id";
	import Mounted from "$lib/components/_shared/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: NavigationMenuListProps = $props();

	const listState = NavigationMenuListState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, listState.props));
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
