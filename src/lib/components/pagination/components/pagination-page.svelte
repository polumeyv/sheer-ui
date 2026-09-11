<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PaginationPageProps } from '../types.js';
	import { PaginationPageState } from '../pagination.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { type ButtonProps, buttonVariants } from '../../button';

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
		get id() {
			return id;
		},
		get page() {
			return page;
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
