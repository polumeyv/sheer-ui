<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { CommandGroupProps } from '../types.js';
	import { CommandGroupContainerState, CommandGroupHeadingState, CommandGroupItemsState } from '../command.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

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
		...restProps
	}: CommandGroupProps & {
		heading?: string;
	} = $props();

	const groupState = CommandGroupContainerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		forceMount: boxWith(() => forceMount),
		value: boxWith(() => value ?? heading ?? `----${id}`),
	});

	const headingState = CommandGroupHeadingState.create({
		id: boxWith(() => headingId),
		ref: boxWith(
			() => headingRef,
			(v) => (headingRef = v),
		),
	});

	const itemsState = CommandGroupItemsState.create({
		id: boxWith(() => itemsId),
		ref: boxWith(
			() => itemsRef,
			(v) => (itemsRef = v),
		),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'command-group', class: 'text-foreground overflow-hidden p-1' }, restProps, groupState.props),
	);

	const headingProps = $derived(mergeProps({ class: 'text-muted-foreground px-2 py-1.5 text-xs font-medium' }, headingState.props));
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
