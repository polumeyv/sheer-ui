<script lang="ts">
	import { mergeProps } from '$lib/vendor';
	import type { TabsRootProps } from '$lib/components/tabs/primitive/index';
	import { TabsRootState } from '$lib/components/tabs/primitive/tabs.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(''),
		onValueChange = () => {},
		orientation = 'horizontal',
		loop = true,
		activationMode = 'automatic',
		disabled = false,
		children,
		child,
		...restProps
	}: TabsRootProps = $props();

	const rootState = TabsRootState.create({
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value;
			},
			set current(v) {
				value = v;
				onValueChange(v);
			},
		},
		orientation: {
			get current() {
				return orientation;
			},
		},
		loop: {
			get current() {
				return loop;
			},
		},
		activationMode: {
			get current() {
				return activationMode;
			},
		},
		disabled: {
			get current() {
				return disabled;
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

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
