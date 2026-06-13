<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { TimeFieldInputState } from "$lib/components/time-field/time-field.svelte.js";
	import type { TimeFieldInputProps } from "$lib/components/time-field/index.js";
	import DateFieldHiddenInput from "$lib/components/time-field/components/time-field-hidden-input.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		children,
		child,
		...restProps
	}: TimeFieldInputProps = $props();

	const inputState = TimeFieldInputState.create({
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
