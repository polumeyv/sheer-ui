<script lang="ts">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { TabsRootProps } from '../types.js';
	import { TabsRootState } from '../tabs.svelte.js';
	import { createId } from '../../../internal/create-id.js';

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
		get id() {
			return id;
		},
		get value() {
			return value;
		},
		set value(v) {
			value = v;
			onValueChange(v);
		},
		get orientation() {
			return orientation;
		},
		get loop() {
			return loop;
		},
		get activationMode() {
			return activationMode;
		},
		get disabled() {
			return disabled;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'tabs', class: 'flex flex-col gap-2' }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
