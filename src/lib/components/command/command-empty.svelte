<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { CommandEmptyProps } from '$lib/components/command/primitive/index.js';
	import { CommandEmptyState } from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
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
