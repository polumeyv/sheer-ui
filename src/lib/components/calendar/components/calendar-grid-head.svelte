<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { CalendarGridHeadState } from "$lib/components/calendar/calendar.svelte.js";
	import type { CalendarGridHeadProps } from "$lib/components/calendar/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridHeadProps = $props();

	const gridHeadState = CalendarGridHeadState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
