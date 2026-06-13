<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { NavigationMenuListProps } from "$lib/components/navigation-menu/primitive/index.js";
	import { NavigationMenuListState } from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
