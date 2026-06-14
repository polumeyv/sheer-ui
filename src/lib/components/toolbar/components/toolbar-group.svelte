<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeProps } from '$lib/merge-props';
	import type { WritableProp } from '$lib/vendor/utils';
	import type { ToolbarGroupProps } from '$lib/components/toolbar';
	import { ToolbarGroupState } from '$lib/components/toolbar/toolbar.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = () => {},
		type,
		disabled = false,
		child,
		children,
		...restProps
	}: ToolbarGroupProps = $props();

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

	const groupState = ToolbarGroupState.create({
		id: {
			get current() {
				return id;
			},
		},
		disabled: {
			get current() {
				return disabled;
			},
		},
		type,
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
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
