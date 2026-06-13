<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { CalendarGridRowState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarGridRowProps } from "$lib/components/calendar/types.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
