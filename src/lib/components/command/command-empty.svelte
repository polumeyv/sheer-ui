<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { CommandEmptyProps } from '$lib/components/command/primitive/index';
	import { CommandEmptyState } from '$lib/components/command/primitive/command.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		class: className,
		...restProps
	}: CommandEmptyProps = $props();

	const emptyState = CommandEmptyState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		forceMount: { get current() { return forceMount; } },
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-empty',
				class: cn('py-6 text-center text-sm', className),
			},
			restProps,
			emptyState.props
		)
	);
</script>

{#if emptyState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
