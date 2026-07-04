<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { CommandSeparatorProps } from '../types.js';
	import { CommandSeparatorState } from '../command.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), forceMount = false, children, child, ...restProps }: CommandSeparatorProps = $props();

	const separatorState = CommandSeparatorState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		forceMount: boxWith(() => forceMount),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'command-separator', class: 'bg-border -mx-1 h-px' }, restProps, separatorState.props),
	);
</script>

{#if separatorState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
