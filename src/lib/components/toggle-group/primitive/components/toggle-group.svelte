<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeProps } from '$lib/internal/merge-props.js';
	import type { WritableProp } from '$lib/vendor/utils.js';
	import type { ToggleGroupRootProps } from '$lib/components/toggle-group/primitive/index.js';
	import { ToggleGroupRootState } from '$lib/components/toggle-group/primitive/toggle-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		type,
		disabled = false,
		loop = true,
		orientation = 'horizontal',
		rovingFocus = true,
		child,
		children,
		...restProps
	}: ToggleGroupRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === 'single' ? '' : [];
	}

	// SSR
	handleDefaultValue();

	$effect.pre(() => {
		void value;
		untrack(() => handleDefaultValue());
	});

	const rootState = ToggleGroupRootState.create({
		id: {
			get current() {
				return id;
			},
		},
		value: {
			get current() {
				return value!;
			},
			set current(v) {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			},
		} as WritableProp<string> | WritableProp<string[]>,
		disabled: {
			get current() {
				return disabled;
			},
		},
		loop: {
			get current() {
				return loop;
			},
		},
		orientation: {
			get current() {
				return orientation;
			},
		},
		rovingFocus: {
			get current() {
				return rovingFocus;
			},
		},
		type,
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
