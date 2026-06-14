<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { MenuCheckboxGroupProps } from '$lib/components/_shared/menu/index';
	import { MenuCheckboxGroupState } from '$lib/components/_shared/menu/checkbox.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = () => {},
		...restProps
	}: MenuCheckboxGroupProps = $props();

	const checkboxGroupState = MenuCheckboxGroupState.create({
		value: {
			get current() {
				return $state.snapshot(value);
			},
			set current(v) {
				value = $state.snapshot(v);
				onValueChange(v);
			},
		},
		onValueChange: {
			get current() {
				return onValueChange;
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
		id: {
			get current() {
				return id;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, checkboxGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
