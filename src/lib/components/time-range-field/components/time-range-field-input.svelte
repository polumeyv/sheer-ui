<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { TimeRangeFieldInputProps } from "$lib/components/time-range-field/index";
	import { TimeRangeFieldInputState } from "$lib/components/time-range-field/time-range-field.svelte";
	import { createId } from "$lib/vendor/create-id";
	import TimeFieldHiddenInput from "$lib/components/time-field/components/time-field-hidden-input.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		child,
		children,
		type,
		...restProps
	}: TimeRangeFieldInputProps = $props();

	const inputState = TimeRangeFieldInputState.create(
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

<TimeFieldHiddenInput />
