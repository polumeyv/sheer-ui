<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { CommandSeparatorProps } from '$lib/components/command/primitive/types.js';
	import { CommandSeparatorState } from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		children,
		child,
		class: className,
		...restProps
	}: CommandSeparatorProps = $props();

	const separatorState = CommandSeparatorState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: boxWith(() => forceMount),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-separator',
				class: cn('bg-border -mx-1 h-px', className),
			},
			restProps,
			separatorState.props
		)
	);
</script>

{#if separatorState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
