<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { PopoverCloseProps } from '../types.js';
	import { PopoverCloseState } from '../popover.svelte.js';

	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let { child, children, id = createId(uid), ref = $bindable(null), ...restProps }: PopoverCloseProps = $props();

	const closeState = PopoverCloseState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'popover-close',
			},
			closeState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
