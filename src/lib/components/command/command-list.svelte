<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { CommandListProps } from '$lib/bits/command/types.js';
	import { CommandListState } from '$lib/bits/command/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		ariaLabel: boxWith(() => ariaLabel ?? 'Suggestions...'),
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
