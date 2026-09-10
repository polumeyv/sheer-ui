<script lang="ts">
	import { boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { SelectionValue, emptySelection } from '../../../internal/selection.svelte.js';
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

	// Mode is fixed at mount: `value` keeps the shape it was declared with.
	// svelte-ignore state_referenced_locally
	const valueType = type;

	repairBindable(
		() => value,
		() => {
			if (value === undefined) value = emptySelection(valueType);
		},
	);

	const groupState = ToolbarGroupState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		selection: new SelectionValue(
			valueType,
			() => value ?? emptySelection(valueType),
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
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
