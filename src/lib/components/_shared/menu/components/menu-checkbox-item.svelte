<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { MenuCheckboxItemProps } from "$lib/components/_shared/menu/types.js";
	import { getMenuCheckboxGroupContextOr, MenuCheckboxItemState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "$lib/vendor/runed/index.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = createId(uid),
		onCheckedChange = noop,
		disabled = false,
		onSelect = noop,
		closeOnSelect = true,
		indeterminate = $bindable(false),
		onIndeterminateChange = noop,
		value = "",
		...restProps
	}: MenuCheckboxItemProps = $props();

	const group = getMenuCheckboxGroupContextOr(null);

	if (group && value) {
		if (group.opts.value.current.includes(value)) {
			checked = true;
		} else {
			checked = false;
		}
	}

	watch.pre(
		() => value,
		() => {
			if (group && value) {
				if (group.opts.value.current.includes(value)) {
					checked = true;
				} else {
					checked = false;
				}
			}
		}
	);

	const checkboxItemState = MenuCheckboxItemState.create(
		{
			checked: boxWith(
				() => checked,
				(v) => {
					if (v !== checked) {
						checked = v;
						onCheckedChange(v);
					}
				}
			),
			id: boxWith(() => id),
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => handleSelect),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			closeOnSelect: boxWith(() => closeOnSelect),
			indeterminate: boxWith(
				() => indeterminate,
				(v) => {
					if (v !== indeterminate) {
						indeterminate = v;
						onIndeterminateChange(v);
					}
				}
			),
			value: boxWith(() => value),
		},
		group
	);

	function handleSelect(e: Event) {
		onSelect(e);
		if (e.defaultPrevented) return;
		checkboxItemState.toggleChecked();
	}

	const mergedProps = $derived(mergeProps(restProps, checkboxItemState.props));
</script>

{#if child}
	{@render child({ checked, indeterminate, props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ checked, indeterminate })}
	</div>
{/if}
