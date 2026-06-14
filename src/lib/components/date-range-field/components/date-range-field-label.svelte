<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { DateRangeFieldLabelState } from "$lib/components/date-range-field/date-range-field.svelte";
	import type { DateRangeFieldLabelProps } from "$lib/components/date-range-field/index";
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
