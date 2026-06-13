<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CheckboxRootProps } from "$lib/components/checkbox/primitive/index.js";
	import { getCheckboxGroupContextOr, CheckboxRootState } from "$lib/components/checkbox/primitive/checkbox.svelte.js";
	import CheckboxInput from "$lib/components/checkbox/primitive/components/checkbox-input.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { watch } from "$lib/vendor/watch.svelte.js";

	const uid = $props.id();

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		onCheckedChange,
		children,
		disabled = false,
		required = false,
		name = undefined,
		value = "on",
		id = createId(uid),
		indeterminate = $bindable(false),
		onIndeterminateChange,
		child,
		type = "button",
		readonly,
		...restProps
	}: CheckboxRootProps = $props();

	const group = getCheckboxGroupContextOr(null);

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

	const rootState = CheckboxRootState.create(
		{
			checked: { get current() { return checked; }, set current(v) { checked = v; onCheckedChange?.(v); } },
			disabled: { get current() { return disabled ?? false; } },
			required: { get current() { return required; } },
			name: { get current() { return name; } },
			value: { get current() { return value; } },
			id: { get current() { return id; } },
			ref: { get current() { return ref; }, set current(v) { (ref = v); } },
			indeterminate: { get current() { return indeterminate; }, set current(v) { indeterminate = v; onIndeterminateChange?.(v); } },
			type: { get current() { return type; } },
			readonly: { get current() { return Boolean(readonly); } },
		},
		group
	);

	const mergedProps = $derived(mergeProps({ ...restProps }, rootState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...rootState.snippetProps,
	})}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}

<CheckboxInput />
