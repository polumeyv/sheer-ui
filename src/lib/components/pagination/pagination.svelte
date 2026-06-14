<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { PaginationRootProps } from '$lib/components/pagination/primitive/index';
	import { PaginationRootState } from '$lib/components/pagination/primitive/pagination.svelte';
	import { createId } from '$lib/vendor/create-id';
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
		id: { get current() { return id; } },
		count: { get current() { return count; } },
		perPage: { get current() { return perPage; } },
		page: { get current() { return page; }, set current(v) { page = v; onPageChange?.(v); } },
		loop: { get current() { return loop; } },
		siblingCount: { get current() { return siblingCount; } },
		orientation: { get current() { return orientation; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
