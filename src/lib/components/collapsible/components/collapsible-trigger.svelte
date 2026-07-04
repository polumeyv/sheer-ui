<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { CollapsibleTriggerProps } from '../types.js';
	import { CollapsibleTriggerState } from '../collapsible.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), disabled = false, ...restProps }: CollapsibleTriggerProps = $props();

	const triggerState = CollapsibleTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => disabled),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'collapsible-trigger' }, restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
