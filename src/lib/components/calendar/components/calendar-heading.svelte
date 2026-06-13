<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CalendarHeadingProps } from "$lib/components/calendar/index.js";
	import { CalendarHeadingState } from "$lib/components/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeadingProps = $props();

	const headingState = CalendarHeadingState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, headingValue: headingState.root.headingValue })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.({ headingValue: headingState.root.headingValue })}
		{:else}
			{headingState.root.headingValue}
		{/if}
	</div>
{/if}
