<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { ToolbarButtonProps } from '../types.js';
	import { ToolbarButtonState } from '../toolbar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { toggleVariants, type ToggleSize, type ToggleVariant } from '$lib/components/toggle/variants.js';

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		type = 'button',
		id = createId(uid),
		ref = $bindable(null),
		variant = 'default',
		size = 'default',
		...restProps
	}: ToolbarButtonProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();

	const buttonState = ToolbarButtonState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'toolbar-button', class: toggleVariants({ variant, size }) }, restProps, buttonState.props, { type }),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
