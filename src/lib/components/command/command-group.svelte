<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/index.js';
	import type { CommandGroupProps } from '$lib/components/command/primitive/index.js';
	import {
		CommandGroupContainerState,
		CommandGroupHeadingState,
		CommandGroupItemsState,
	} from '$lib/components/command/primitive/command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();
	const headingId = createId('command-group-heading', uid);
	const itemsId = createId('command-group-items', uid);

	let headingRef = $state<HTMLElement | null>(null);
	let itemsRef = $state<HTMLElement | null>(null);

	let {
		id = createId(uid),
		ref = $bindable(null),
		value,
		forceMount = false,
		children,
		child,
		heading,
		class: className,
		...restProps
	}: CommandGroupProps & {
		heading?: string;
	} = $props();

	const groupState = CommandGroupContainerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: boxWith(() => forceMount),
		value: boxWith(() => value ?? heading ?? `----${id}`),
	});

	const headingState = CommandGroupHeadingState.create({
		id: boxWith(() => headingId),
		ref: boxWith(
			() => headingRef,
			(v) => (headingRef = v)
		),
	});

	const itemsState = CommandGroupItemsState.create({
		id: boxWith(() => itemsId),
		ref: boxWith(
			() => itemsRef,
			(v) => (itemsRef = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'command-group',
				class: cn('text-foreground overflow-hidden p-1', className),
			},
			restProps,
			groupState.props
		)
	);

	const headingProps = $derived(
		mergeProps(
			{
				class: 'text-muted-foreground px-2 py-1.5 text-xs font-medium',
			},
			headingState.props
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{#if heading}
			<div {...headingProps}>
				{heading}
			</div>
		{/if}
		<div style="display: contents;">
			<div {...itemsState.props}>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
