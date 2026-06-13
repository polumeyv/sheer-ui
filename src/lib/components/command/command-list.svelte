<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { CommandListProps } from '$lib/components/command/primitive/index.js';
	import { CommandListState } from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		'aria-label': ariaLabel,
		class: className,
		...restProps
	}: CommandListProps = $props();

	const listState = CommandListState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		ariaLabel: { get current() { return ariaLabel ?? 'Suggestions...'; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-list',
				class: cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className),
			},
			restProps,
			listState.props
		)
	);
</script>

{#key listState.root._commandState.search === ''}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/key}
