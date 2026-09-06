<script lang="ts">
	import { untrack } from 'svelte';
	import { boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { emptySelection } from '../../../internal/selection.svelte.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ToolbarGroupProps } from '../types.js';
	import { ToolbarGroupState } from '../toolbar.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		type,
		disabled = false,
		child,
		children,
		...restProps
	}: ToolbarGroupProps = $props();

	// Mode is construction-static: the selection stays single or multiple for the group's life.
	const valueType = untrack(() => type);

	// The group owns a mode-specific controlled value.
	repairBindable(
		() => value,
		() => {
			if (value === undefined) value = emptySelection(valueType);
		},
	);

	const groupState = ToolbarGroupState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		type: valueType,
		value: boxWith(
			() => value ?? emptySelection(valueType),
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			},
		),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'toolbar-group', class: 'flex items-center gap-1' }, restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
