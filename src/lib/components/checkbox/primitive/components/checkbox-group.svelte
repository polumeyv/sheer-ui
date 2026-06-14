<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { CheckboxGroupProps } from "$lib/components/checkbox/primitive/index";
	import { CheckboxGroupState } from "$lib/components/checkbox/primitive/checkbox.svelte";
	import { createId } from "$lib/vendor/create-id";
	import { arraysAreEqual } from "$lib/vendor/arrays";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		value = $bindable([]),
		onValueChange = (() => {}),
		name,
		required,
		disabled,
		children,
		child,
		readonly,
		...restProps
	}: CheckboxGroupProps = $props();

	const groupState = CheckboxGroupState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
		required: { get current() { return Boolean(required); } },
		readonly: { get current() { return Boolean(readonly); } },
		name: { get current() { return name; } },
		value: { get current() { return $state.snapshot(value); }, set current(v) { if (arraysAreEqual(value, v)) return; value = $state.snapshot(v); onValueChange(v); } },
		onValueChange: { get current() { return onValueChange; } },
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
