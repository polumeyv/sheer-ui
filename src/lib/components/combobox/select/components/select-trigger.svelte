<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../merge-props.js';
	import { SelectTriggerState } from '../select.svelte.js';
	import type { SelectTriggerProps } from '../types.js';
	import { createId } from '../../../../internal/create-id.js';
	import { floatingAnchor } from '../../../utilities/floating-layer/index.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), child, children, type = 'button', ...restProps }: SelectTriggerProps = $props();

	const triggerState = SelectTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));

	const anchor = floatingAnchor();
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, anchor) })}
{:else}
	<button {...mergeProps(mergedProps, anchor)}>
		{@render children?.()}
	</button>
{/if}
