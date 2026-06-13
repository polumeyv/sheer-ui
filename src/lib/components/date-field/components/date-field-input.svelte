<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { DateFieldInputState } from "$lib/components/date-field/date-field.svelte.js";
	import type { DateFieldInputProps } from "$lib/components/date-field/index.js";
	import DateFieldHiddenInput from "$lib/components/date-field/components/date-field-hidden-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		children,
		child,
		...restProps
	}: DateFieldInputProps = $props();

	const inputState = DateFieldInputState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		name: { get current() { return name; } },
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
