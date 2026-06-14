<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeProps } from '$lib/vendor/index';
	import type { MenuCheckboxItemProps } from '$lib/components/_shared/menu/index';
	import { getMenuCheckboxGroupContextOr } from '$lib/components/_shared/menu/context.svelte';
	import { MenuCheckboxItemState } from '$lib/components/_shared/menu/checkbox.svelte';
	import { createId } from '$lib/vendor/create-id';
	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		checked = $bindable(false),
		id = createId(uid),
		onCheckedChange = () => {},
		disabled = false,
		onSelect = () => {},
		closeOnSelect = true,
		indeterminate = $bindable(false),
		onIndeterminateChange = () => {},
		value = '',
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

	$effect.pre(() => {
		void value;
		untrack(() => {
			if (group && value) {
				if (group.opts.value.current.includes(value)) {
					checked = true;
				} else {
					checked = false;
				}
			}
		});
	});

	const checkboxItemState = MenuCheckboxItemState.create(
		{
			checked: {
				get current() {
					return checked;
				},
				set current(v) {
					if (v !== checked) {
						checked = v;
						onCheckedChange(v);
					}
				},
			},
			id: {
				get current() {
					return id;
				},
			},
			disabled: {
				get current() {
					return disabled;
				},
			},
			onSelect: {
				get current() {
					return handleSelect;
				},
			},
			ref: {
				get current() {
					return ref;
				},
				set current(v) {
					ref = v;
				},
			},
			closeOnSelect: {
				get current() {
					return closeOnSelect;
				},
			},
			indeterminate: {
				get current() {
					return indeterminate;
				},
				set current(v) {
					if (v !== indeterminate) {
						indeterminate = v;
						onIndeterminateChange(v);
					}
				},
			},
			value: {
				get current() {
					return value;
				},
			},
		},
		group,
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
