<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { RadioGroupItemProps } from '$lib/components/radio-group/primitive/index';
	import { RadioGroupItemState } from '$lib/components/radio-group/primitive/radio-group.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let { id = createId(uid), children, child, value, disabled = false, ref = $bindable(null), ...restProps }: RadioGroupItemProps = $props();

	const itemState = RadioGroupItemState.create({
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

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
