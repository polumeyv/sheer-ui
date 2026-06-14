<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { SelectValueState } from "$lib/components/combobox/primitive/select.svelte";
	import type { SelectValueProps } from "$lib/components/combobox/primitive/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		placeholder,
		child,
		children,
		...restProps
	}: SelectValueProps = $props();

	const valueState = SelectValueState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		placeholder: { get current() { return placeholder; } },
	});

	const mergedProps = $derived(mergeProps(restProps, valueState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...valueState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{#if children}
			{@render children?.(valueState.snippetProps)}
		{:else if valueState.snippetProps.selection.type === "single"}
			{valueState.snippetProps.selection.selected?.label ?? placeholder}
		{:else if valueState.snippetProps.selection.type === "multiple" && valueState.snippetProps.selection.selected}
			{valueState.snippetProps.selection.selected.length > 0
				? valueState.snippetProps.selection.selected
						.map((selected) => selected.label)
						.join(", ")
				: placeholder}
		{:else}
			{placeholder}
		{/if}
	</span>
{/if}
