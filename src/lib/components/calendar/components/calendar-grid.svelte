<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { CalendarGridState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarGridProps } from "$lib/components/calendar/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridProps = $props();

	const gridState = CalendarGridState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, gridState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<table {...mergedProps}>
		{@render children?.()}
	</table>
{/if}
