<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuItemProps } from "$lib/components/_shared/menu/index.js";
	import { MenuItemState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

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
