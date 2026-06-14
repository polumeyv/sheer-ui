<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { CalendarGridBodyProps } from "$lib/components/primitive/calendar/index";
	import { CalendarGridBodyState } from "$lib/components/primitive/calendar/calendar.svelte";
	import { createId } from "$lib/vendor/create-id";

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
