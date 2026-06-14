<script lang="ts" module>
	import { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants } from './variants';
	export { toggleVariants, type ToggleVariant, type ToggleSize, type ToggleVariants };
</script>

<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ToggleRootProps } from '$lib/components/primitive/toggle/index';
	import { ToggleRootState } from '$lib/components/primitive/toggle/toggle.svelte';
	import { createId } from '$lib/vendor/create-id';
	import { cn } from '../../vendor/utils';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		pressed = $bindable(false),
		onPressedChange = () => {},
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
		pressed: {
			get current() {
				return pressed;
			},
			set current(v) {
				pressed = v;
				onPressedChange(v);
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
			},
		},
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'toggle',
				class: cn(toggleVariants({ variant, size }), className),
			},
			restProps,
			toggleState.props,
			{ type },
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...toggleState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(toggleState.snippetProps)}
	</button>
{/if}
