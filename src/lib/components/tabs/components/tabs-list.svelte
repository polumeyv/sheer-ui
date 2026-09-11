<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { TabsListProps } from '../types.js';
	import { TabsListState } from '../tabs.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { child, children, id = createId(uid), ref = $bindable(null), ...restProps }: TabsListProps = $props();

	const listState = TabsListState.create({
		get id() {
			return id;
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
				'data-slot': 'tabs-list',
				class: 'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-0.75',
			},
			restProps,
			listState.props,
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
