<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ToggleRootProps } from '../types.js';
	import { ToggleRootState } from '../toggle.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { toggleVariants, type ToggleSize, type ToggleVariant } from '../variants.js';

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
		variant = 'default',
		size = 'default',
		...restProps
	}: ToggleRootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();

	const toggleState = ToggleRootState.create({
		get pressed() {
			return pressed;
		},
		set pressed(v) {
			pressed = v;
			onPressedChange(v);
		},
		get disabled() {
			return disabled ?? false;
		},
		get id() {
			return id;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'toggle', class: toggleVariants({ variant, size }) }, restProps, toggleState.props, { type }),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...toggleState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(toggleState.snippetProps)}
	</button>
{/if}
