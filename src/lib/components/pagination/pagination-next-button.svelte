<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { PaginationNextButtonProps } from '$lib/components/primitive/pagination/index';
	import { PaginationButtonState } from '$lib/components/primitive/pagination/pagination.svelte';
	import { createId } from '$lib/vendor/create-id';
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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
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
