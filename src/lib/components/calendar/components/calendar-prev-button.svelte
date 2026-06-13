<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CalendarPrevButtonProps } from "$lib/components/calendar/index.js";
	import { CalendarPrevButtonState } from "$lib/components/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		// for safari
		tabindex = 0,
		...restProps
	}: CalendarPrevButtonProps = $props();

	const prevButtonState = CalendarPrevButtonState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, prevButtonState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
