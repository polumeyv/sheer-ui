<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { MenuRadioItemProps } from "$lib/components/_shared/menu/index.js";
	import { MenuRadioItemState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		onSelect = (() => {}),
		id = createId(uid),
		disabled = false,
		closeOnSelect = true,
		...restProps
	}: MenuRadioItemProps = $props();

	const radioItemState = MenuRadioItemState.create({
		value: { get current() { return value; } },
		id: { get current() { return id; } },
		disabled: { get current() { return disabled; } },
		onSelect: { get current() { return handleSelect; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		closeOnSelect: { get current() { return closeOnSelect; } },
	});

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		radioItemState.selectValue();
	}

	const mergedProps = $derived(mergeProps(restProps, radioItemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: radioItemState.isChecked })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked: radioItemState.isChecked })}
	</div>
{/if}
