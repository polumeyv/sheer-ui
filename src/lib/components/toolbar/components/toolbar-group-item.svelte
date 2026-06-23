<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { ToolbarGroupItemProps } from '../types.js';
	import { ToolbarGroupItemState } from '../toolbar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { toggleVariants, type ToggleSize, type ToggleVariant } from '$lib/components/toggle/variants.js';

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

	const groupItemState = ToolbarGroupItemState.create({
		id: boxWith(() => id),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
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
	{@render child({ props: mergedProps, pressed: groupItemState.isPressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: groupItemState.isPressed })}
	</button>
{/if}
