<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { PaginationPrevButtonProps } from '$lib/bits/pagination/types.js';
	import { PaginationButtonState } from '$lib/bits/pagination/pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { buttonVariants } from '../button';
	import { cn } from '../../utils';

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
