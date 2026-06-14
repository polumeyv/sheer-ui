<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { PaginationPageProps } from '$lib/components/pagination/primitive/index';
	import { PaginationPageState } from '$lib/components/pagination/primitive/pagination.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';
	import { type Props, buttonVariants } from '../button';

	const uid = $props.id();

	let {
		id = createId(uid),
		page,
		child,
		children,
		type = 'button',
		ref = $bindable(null),
		disabled = false,
		size = 'icon',
		isActive,
		class: className,
		...restProps
	}: PaginationPageProps &
		Props & {
			isActive: boolean;
		} = $props();

	const pageState = PaginationPageState.create({
		id: { get current() { return id; } },
		page: { get current() { return page; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		disabled: { get current() { return Boolean(disabled); } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-current': isActive ? 'page' : undefined,
				'data-slot': 'pagination-link',
				'data-active': isActive,
				class: cn(
					buttonVariants({
						variant: isActive ? 'outline' : 'ghost',
						size,
					}),
					className
				),
			},
			restProps,
			pageState.props,
			{ type }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
