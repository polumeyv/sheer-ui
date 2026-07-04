<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuGroupProps } from '../types.js';
	import { MenuGroupState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, ref = $bindable(null), id = createId(uid), ...restProps }: MenuGroupProps = $props();

	const groupState = MenuGroupState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});
	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-group',
			},
			restProps,
			groupState.props,
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
