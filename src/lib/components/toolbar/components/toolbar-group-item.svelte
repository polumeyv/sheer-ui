<script lang="ts">
	import { mergeProps } from '$lib/internal/merge-props.js';
	import type { ToolbarGroupItemProps } from '$lib/components/toolbar/index.js';
	import { ToolbarGroupItemState } from '$lib/components/toolbar/toolbar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		child,
		children,
		value,
		disabled = false,
		type = 'button',
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ToolbarGroupItemProps = $props();

	const groupItemState = ToolbarGroupItemState.create({
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value;
			},
		},
		disabled: {
			get current() {
				return disabled ?? false;
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

	const mergedProps = $derived(mergeProps(restProps, groupItemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, pressed: groupItemState.isPressed })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: groupItemState.isPressed })}
	</button>
{/if}
