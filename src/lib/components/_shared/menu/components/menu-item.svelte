<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { MenuItemProps } from "$lib/components/_shared/menu/index";
	import { MenuItemState } from "$lib/components/_shared/menu/item.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		onSelect = (() => {}),
		closeOnSelect = true,
		...restProps
	}: MenuItemProps = $props();

	const itemState = MenuItemState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled; } },
		onSelect: { get current() { return onSelect; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		closeOnSelect: { get current() { return closeOnSelect; } },
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
