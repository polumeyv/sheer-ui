<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { DateFieldSegmentState } from "$lib/components/date-field/date-field.svelte";
	import type { DateFieldSegmentProps } from "$lib/components/date-field/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		part,
		...restProps
	}: DateFieldSegmentProps = $props();

	const segmentState = DateFieldSegmentState.create(part, {
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps(restProps, segmentState.props as Record<string, unknown>)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
