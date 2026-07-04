<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { TimeFieldSegmentState } from '../time-field.svelte.js';
	import type { TimeFieldSegmentProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, part, ...restProps }: TimeFieldSegmentProps = $props();

	const segmentState = TimeFieldSegmentState.create(part, {
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, segmentState.props as Record<string, unknown>));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
