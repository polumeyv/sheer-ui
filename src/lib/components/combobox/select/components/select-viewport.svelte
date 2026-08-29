<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../internal/merge-props.js';
	import type { SelectViewportProps } from '../types.js';
	import { SelectViewportState } from '../select.svelte.js';
	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, ...restProps }: SelectViewportProps = $props();

	const viewportState = SelectViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ class: 'scrollbar-hidden' }, restProps, viewportState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
