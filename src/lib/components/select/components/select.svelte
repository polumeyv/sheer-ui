<script lang="ts">
	import { untrack } from 'svelte';
	import FloatingLayer from '../../utilities/floating-layer/components/floating-layer.svelte';
	import { type WritableBox, boxWith, repairBindable } from '../../../internal/tools/index.js';
	import { SelectRootState } from '../select.svelte.js';
	import type { SelectRootProps } from '../types.js';
	import SelectHiddenInput from './select-hidden-input.svelte';

	let {
		value = $bindable(),
		onValueChange = () => {},
		name = '',
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = () => {},
		onOpenChangeComplete = () => {},
		loop = false,
		scrollAlignment = 'nearest',
		required = false,
		items = [],
		allowDeselect = false,
		autocomplete,
		children,
	}: SelectRootProps = $props();

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		value = type === 'single' ? '' : [];
	}

	// Select owns a mode-specific controlled value.
	repairBindable(() => value, repairUndefinedControlledValue);

	let inputValue = $state('');

	const rootState = SelectRootState.create({
		type: untrack(() => type),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			},
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: boxWith(() => disabled),
		required: boxWith(() => required),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			},
		),
		loop: boxWith(() => loop),
		scrollAlignment: boxWith(() => scrollAlignment),
		name: boxWith(() => name),
		isCombobox: false,
		items: boxWith(() => items),
		allowDeselect: boxWith(() => allowDeselect),
		inputValue: boxWith(
			() => inputValue,
			(v) => (inputValue = v),
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>

{#if Array.isArray(rootState.opts.value.current)}
	{#if rootState.opts.value.current.length === 0}
		<SelectHiddenInput {autocomplete} />
	{:else}
		{#each rootState.opts.value.current as item (item)}
			<SelectHiddenInput value={item} {autocomplete} />
		{/each}
	{/if}
{:else}
	<SelectHiddenInput bind:value={rootState.opts.value.current as string} {autocomplete} />
{/if}
