<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import { CalendarNextButtonState } from "$lib/components/calendar/calendar.svelte";
	import type { CalendarNextButtonProps } from "$lib/components/calendar/index";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		// for safari
		tabindex = 0,
		...restProps
	}: CalendarNextButtonProps = $props();

	const nextButtonState = CalendarNextButtonState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
