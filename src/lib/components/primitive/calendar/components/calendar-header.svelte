<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import { CalendarHeaderState } from "$lib/components/primitive/calendar/calendar.svelte";
	import type { CalendarHeaderProps } from "$lib/components/primitive/calendar/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeaderProps = $props();

	const headerState = CalendarHeaderState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<header {...mergedProps}>
		{@render children?.()}
	</header>
{/if}
