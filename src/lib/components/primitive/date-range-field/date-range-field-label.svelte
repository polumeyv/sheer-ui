<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { DateRangeFieldLabelState } from "./date-range-field.svelte.js";
	import type { DateRangeFieldLabelProps } from "$lib/components/primitive/date-range-field/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: DateRangeFieldLabelProps = $props();

	const labelState = DateRangeFieldLabelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
