<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { PaginationNextButtonProps } from '$lib/components/pagination/primitive/index.js';
	import { PaginationButtonState } from '$lib/components/pagination/primitive/pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { buttonVariants } from '../button';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		type = 'button',
		disabled = false,
		class: className,
		...restProps
	}: PaginationNextButtonProps = $props();

	const nextButtonState = PaginationButtonState.create({
		type: 'next',
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-label': 'Go to next page',
				class: cn(
					buttonVariants({
						size: 'default',
						variant: 'ghost',
						class: 'gap-1! sm:pe-2.5',
					}),
					className
				),
			},
			restProps,
			nextButtonState.props,
			{ type }
		)
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
