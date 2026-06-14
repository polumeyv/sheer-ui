<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { DateRangeFieldInputProps } from "$lib/components/date-range-field/index";
	import { DateRangeFieldInputState } from "$lib/components/date-range-field/date-range-field.svelte";
	import { createId } from "$lib/vendor/create-id";
	import DateFieldHiddenInput from "$lib/components/date-field/components/date-field-hidden-input.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		child,
		children,
		type,
		...restProps
	}: DateRangeFieldInputProps = $props();

	const inputState = DateRangeFieldInputState.create(
		{
			id: { get current() { return id; } },
			ref: { get current() { return ref; }, set current(v) { (ref = v); } },
			name: { get current() { return name; } },
		},
		type
	);

	const mergedProps = $derived(mergeProps(restProps, inputState.props, { role: "presentation" }));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
