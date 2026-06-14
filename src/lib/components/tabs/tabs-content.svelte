<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { TabsContentProps } from '$lib/components/primitive/tabs/index';
	import { TabsContentState } from '$lib/components/primitive/tabs/tabs.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let { children, child, id = createId(uid), ref = $bindable(null), value, class: className, ...restProps }: TabsContentProps = $props();

	const contentState = TabsContentState.create({
		value: {
			get current() {
				return value;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tabs-content',
				class: cn('flex-1 outline-none', className),
			},
			restProps,
			contentState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
