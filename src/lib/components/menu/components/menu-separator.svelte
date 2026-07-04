<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuSeparatorProps } from '../types.js';
	import { MenuSeparatorState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { ref = $bindable(null), id = createId(uid), child, children, ...restProps }: MenuSeparatorProps = $props();

	const separatorState = MenuSeparatorState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-separator',
				class: 'bg-border -mx-1 my-1 h-px',
			},
			restProps,
			separatorState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
