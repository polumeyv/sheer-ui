<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { DateFieldSegmentState } from "$lib/components/time-field/time-field.svelte.js";
	import type { TimeFieldSegmentProps } from "$lib/components/time-field/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		part,
		...restProps
	}: TimeFieldSegmentProps = $props();

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
