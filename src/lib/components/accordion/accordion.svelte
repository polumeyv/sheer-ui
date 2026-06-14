<script lang="ts">
	import { untrack } from 'svelte';
	import { mergeProps } from '$lib/vendor';
	import type { WritableProp } from '$lib/vendor/utils';
	import { AccordionRootState } from '$lib/components/accordion/primitive/accordion.svelte';
	import type { AccordionRootProps } from '$lib/components/accordion/primitive/index';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		type,
		value = $bindable(),
		ref = $bindable(null),
		id = createId(uid),
		onValueChange = () => {},
		loop = true,
		orientation = 'vertical',
		...restProps
	}: AccordionRootProps = $props();

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

	const rootState = AccordionRootState.create({
		type,
		value: {
			get current() {
				return value!;
			},
			set current(v) {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			},
		} as WritableProp<string> | WritableProp<string[]>,
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
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'accordion' }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
