<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { CalendarGridState } from '../calendar.svelte.js';
	import type { CalendarGridProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), ...restProps }: CalendarGridProps = $props();

	const gridState = CalendarGridState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<table {...mergedProps}>
		{@render children?.()}
	</table>
{/if}
