<script lang="ts">
	import { untrack } from 'svelte';
	import { type WritableBox, boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { AccordionRootState } from '../accordion.svelte.js';
	import type { AccordionRootProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';

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

	function getDefaultValue(): string | string[] {
		return type === 'single' ? '' : [];
	}

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = getDefaultValue();
	}

	// SSR
	handleDefaultValue();

	const rootState = AccordionRootState.create({
		type,
		value: boxWith(
			() => value ?? getDefaultValue(),
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			},
		) as WritableBox<string> | WritableBox<string[]>,
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
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
