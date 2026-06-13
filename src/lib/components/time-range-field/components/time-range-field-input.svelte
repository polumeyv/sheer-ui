<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { TimeRangeFieldInputProps } from "$lib/components/time-range-field/index.js";
	import { TimeRangeFieldInputState } from "$lib/components/time-range-field/time-range-field.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
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
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => (ref = v)
			),
			name: boxWith(() => name),
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
