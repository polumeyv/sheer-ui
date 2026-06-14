<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { PaginationPrevButtonProps } from '$lib/components/primitive/pagination/index';
	import { PaginationButtonState } from '$lib/components/primitive/pagination/pagination.svelte';
	import { createId } from '$lib/vendor/create-id';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
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
	}: PaginationPrevButtonProps = $props();

	const prevButtonState = PaginationButtonState.create({
		type: 'prev',
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-label': 'Go to previous page',
				class: cn(
					buttonVariants({
						size: 'default',
						variant: 'ghost',
						class: 'gap-1! sm:ps-2.5',
					}),
					className
				),
			},
			restProps,
			prevButtonState.props,
			{ type }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		<ChevronLeftIcon />
		<span class="hidden sm:block">Previous</span>
	</button>
{/if}
