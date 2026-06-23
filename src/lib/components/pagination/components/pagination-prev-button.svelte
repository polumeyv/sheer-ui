<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { PaginationPrevButtonProps } from '../types.js';
	import { PaginationButtonState } from '../pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { buttonVariants } from '$lib/components/button';

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		type = 'button',
		disabled = false,
		...restProps
	}: PaginationPrevButtonProps = $props();

	const prevButtonState = PaginationButtonState.create({
		type: 'prev',
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-label': 'Go to previous page',
				class: buttonVariants({
					size: 'default',
					variant: 'ghost',
					class: 'gap-1! sm:ps-2.5',
				}),
			},
			restProps,
			prevButtonState.props,
			{ type },
		),
	);
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span>Previous</span>
{/snippet}

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render (children || Fallback)()}
	</button>
{/if}
