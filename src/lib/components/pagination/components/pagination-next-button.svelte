<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PaginationNextButtonProps } from '../types.js';
	import { PaginationButtonState } from '../pagination.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
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
	}: PaginationNextButtonProps = $props();

	const nextButtonState = PaginationButtonState.create({
		type: 'next',
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
				'aria-label': 'Go to next page',
				class: buttonVariants({
					size: 'default',
					variant: 'ghost',
					class: 'gap-1! sm:pe-2.5',
				}),
			},
			restProps,
			nextButtonState.props,
			{ type },
		),
	);
</script>

{#snippet Fallback()}
	<span>Next</span>
	<ChevronRightIcon class="size-4" />
{/snippet}

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render (children || Fallback)()}
	</button>
{/if}
