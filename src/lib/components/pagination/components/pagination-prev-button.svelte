<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PaginationPrevButtonProps } from '../types.js';
	import { PaginationButtonState } from '../pagination.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { buttonVariants } from '../../button';

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
		get id() {
			return id;
		},
		get disabled() {
			return Boolean(disabled);
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
