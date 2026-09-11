<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PopoverCloseProps } from '../types.js';
	import { PopoverCloseState } from '../popover.svelte.js';

	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { child, children, id = createId(uid), ref = $bindable(null), ...restProps }: PopoverCloseProps = $props();

	const closeState = PopoverCloseState.create({
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
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
