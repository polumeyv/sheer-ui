<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { CalendarGridHeadState } from "$lib/components/calendar/calendar.svelte";
	import type { CalendarGridHeadProps } from "$lib/components/calendar/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridHeadProps = $props();

	const gridHeadState = CalendarGridHeadState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, gridHeadState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<thead {...mergedProps}>
		{@render children?.()}
	</thead>
{/if}
