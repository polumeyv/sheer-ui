<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { PaginationPageProps } from '../types.js';
	import { PaginationPageState } from '../pagination.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { type ButtonProps, buttonVariants } from '$lib/components/button';

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
		...restProps
	}: PaginationPageProps &
		Pick<ButtonProps, 'size'> & {
			isActive: boolean;
		} = $props();

	const pageState = PaginationPageState.create({
		id: boxWith(() => id),
		page: boxWith(() => page),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'aria-current': isActive ? 'page' : undefined,
				'data-slot': 'pagination-link',
				'data-active': isActive,
				class: buttonVariants({
					variant: isActive ? 'outline' : 'ghost',
					size,
				}),
			},
			restProps,
			pageState.props,
			{ type },
		),
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
