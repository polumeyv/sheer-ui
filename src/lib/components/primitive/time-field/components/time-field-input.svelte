<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { TimeFieldInputState } from "$lib/components/primitive/time-field/time-field.svelte";
	import type { TimeFieldInputProps } from "$lib/components/primitive/time-field/index";
	import DateFieldHiddenInput from "$lib/components/primitive/time-field/components/time-field-hidden-input.svelte";
	import { createId } from "$lib/vendor/create-id";

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
