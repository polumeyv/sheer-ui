<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ToolbarGroupItemProps } from '../types.js';
	import { createToolbarGroupItem } from '../toolbar.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { toggleVariants, type ToggleSize, type ToggleVariant } from '../../toggle/variants.js';

	const uid = $props.id();

	let {
		child,
		children,
		value,
		disabled = false,
		type = 'button',
		id = createId(uid),
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		...restProps
	}: ToolbarGroupItemProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();

	const groupItemState = createToolbarGroupItem({
		get id() {
			return id;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled ?? false;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toolbar-group-item',
				class: toggleVariants({ variant, size }),
			},
			restProps,
			groupItemState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...groupItemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(groupItemState.snippetProps)}
	</button>
{/if}
