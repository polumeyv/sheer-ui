<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { CalendarGridRowState } from "$lib/components/calendar/calendar.svelte";
	import type { CalendarGridRowProps } from "$lib/components/calendar/index";
	import { createId } from "$lib/vendor/create-id";

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
