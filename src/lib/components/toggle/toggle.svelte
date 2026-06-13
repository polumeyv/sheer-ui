<script lang="ts" module>
	import { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants } from './variants';
	export { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants };
</script>

<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { ToggleRootProps } from '$lib/components/toggle/primitive/types.js';
	import { ToggleRootState } from '$lib/components/toggle/primitive/toggle.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { noop } from '$lib/internal/noop.js';
	import { cn } from '../../utils.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		pressed = $bindable(false),
		onPressedChange = noop,
		disabled = false,
		type = 'button',
		children,
		child,
		class: className,
		size = 'default',
		variant = 'default',
		...restProps
	}: ToggleRootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();

	const toggleState = ToggleRootState.create({
		pressed: boxWith(
			() => pressed,
			(v) => {
				pressed = v;
				onPressedChange(v);
			}
		),
		disabled: boxWith(() => disabled ?? false),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toggle',
				class: cn(toggleVariants({ variant, size }), className),
			},
			restProps,
			toggleState.props,
			{ type }
		)
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...toggleState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(toggleState.snippetProps)}
	</button>
{/if}
