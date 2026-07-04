<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { LinkPreviewTriggerProps } from '../types.js';
	import { LinkPreviewTriggerState } from '../link-preview.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { ref = $bindable(null), id = createId(uid), child, children, ...restProps }: LinkPreviewTriggerProps = $props();

	const triggerState = LinkPreviewTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'hover-card-trigger' }, restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
