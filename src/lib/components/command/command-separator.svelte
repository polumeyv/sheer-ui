<script lang="ts">
	import { mergeProps } from '$lib/vendor/index.js';
	import type { CommandSeparatorProps } from '$lib/components/command/primitive/index.js';
	import { CommandSeparatorState } from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		forceMount: { get current() { return forceMount; } },
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
