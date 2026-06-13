<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { DateRangeFieldInputProps } from "$lib/components/date-range-field/index.js";
	import { DateRangeFieldInputState } from "$lib/components/date-range-field/date-range-field.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
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

<DateFieldHiddenInput />
