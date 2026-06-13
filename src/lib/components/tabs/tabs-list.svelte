<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { TabsListProps } from '$lib/bits/tabs/types.js';
	import { TabsListState } from '$lib/bits/tabs/tabs.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils.js';

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		...restProps
	}: TabsListProps = $props();

	const listState = TabsListState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'tabs-list',
				class: cn(
					'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
					className
				),
			},
			restProps,
			listState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
