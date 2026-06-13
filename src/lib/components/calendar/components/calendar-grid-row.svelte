<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { CalendarGridRowState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarGridRowProps } from "$lib/components/calendar/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridRowProps = $props();

	const gridRowState = CalendarGridRowState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, gridRowState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tr {...mergedProps}>
		{@render children?.()}
	</tr>
{/if}
