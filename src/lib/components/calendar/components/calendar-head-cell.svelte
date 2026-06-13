<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { CalendarHeadCellState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarHeadCellProps } from "$lib/components/calendar/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeadCellProps = $props();

	const headCellState = CalendarHeadCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<th {...mergedProps}>
		{@render children?.()}
	</th>
{/if}
