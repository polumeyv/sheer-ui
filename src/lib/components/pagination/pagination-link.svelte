<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { PaginationPageProps } from '$lib/components/pagination/primitive/index.js';
	import { PaginationPageState } from '$lib/components/pagination/primitive/pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
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
		id: boxWith(() => id),
		page: boxWith(() => page),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
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
