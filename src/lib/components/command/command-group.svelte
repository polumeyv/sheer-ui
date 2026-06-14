<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { CommandGroupProps } from '$lib/components/command/primitive/index';
	import {
		CommandGroupContainerState,
		CommandGroupHeadingState,
		CommandGroupItemsState,
	} from '$lib/components/command/primitive/command.svelte';
	import { createId } from '$lib/vendor/create-id';
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
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		forceMount: { get current() { return forceMount; } },
		value: { get current() { return value ?? heading ?? `----${id}`; } },
	});

	const headingState = CommandGroupHeadingState.create({
		id: { get current() { return headingId; } },
		ref: { get current() { return headingRef; }, set current(v) { (headingRef = v); } },
	});

	const itemsState = CommandGroupItemsState.create({
		id: { get current() { return itemsId; } },
		ref: { get current() { return itemsRef; }, set current(v) { (itemsRef = v); } },
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
