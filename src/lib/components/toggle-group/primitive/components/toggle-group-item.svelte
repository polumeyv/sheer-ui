<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { ToggleGroupItemProps } from '$lib/components/toggle-group/primitive/index';
	import { ToggleGroupItemState } from '$lib/components/toggle-group/primitive/toggle-group.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		value,
		disabled = false,
		id = createId(uid),
		type = 'button',
		...restProps
	}: ToggleGroupItemProps = $props();

	const itemState = ToggleGroupItemState.create({
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

	const mergedProps = $derived(mergeProps(restProps, itemState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
