<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { PaginationRootProps } from '$lib/components/pagination/primitive/index.js';
	import { PaginationRootState } from '$lib/components/pagination/primitive/pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		count = 0,
		perPage = 10,
		page = $bindable(1),
		ref = $bindable(null),
		siblingCount = 1,
		onPageChange = (() => {}),
		loop = false,
		orientation = 'horizontal',
		child,
		children,
		class: className,
		...restProps
	}: PaginationRootProps = $props();

	const rootState = PaginationRootState.create({
		id: boxWith(() => id),
		count: boxWith(() => count),
		perPage: boxWith(() => perPage),
		page: boxWith(
			() => page,
			(v) => {
				page = v;
				onPageChange?.(v);
			}
		),
		loop: boxWith(() => loop),
		siblingCount: boxWith(() => siblingCount),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				role: 'navigation',
				'aria-label': 'pagination',
				'data-slot': 'pagination',
				class: cn('mx-auto flex w-full justify-center', className),
			},
			restProps,
			rootState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
