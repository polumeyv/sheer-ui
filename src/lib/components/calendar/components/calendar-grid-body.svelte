<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CalendarGridBodyProps } from "$lib/components/calendar/index.js";
	import { CalendarGridBodyState } from "$lib/components/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridBodyProps = $props();

	const gridBodyState = CalendarGridBodyState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, gridBodyState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tbody {...mergedProps}>
		{@render children?.()}
	</tbody>
{/if}
