<script lang="ts">
	import { untrack } from 'svelte';
	import { type WritableBox, boxWith, repairBindable } from '../../../internal/tools/index.js';
	import type { ComboboxRootProps } from '../types.js';
	import FloatingLayer from '../../../internal/floating-layer/components/floating-layer.svelte';
	import { SelectRootState } from '../select/select.svelte.js';
	import ListboxHiddenInput from '../select/components/select-hidden-input.svelte';

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
		allowDeselect = true,
		inputValue = '',
		children,
	}: ComboboxRootProps = $props();

	function repairUndefinedControlledValue() {
		if (value !== undefined) return;
		const defaultValue = type === 'single' ? '' : [];
		value = defaultValue;
	}

	// Combobox owns a mode-specific controlled value.
	repairBindable(() => value, repairUndefinedControlledValue);

	const rootState = SelectRootState.create({
		type: untrack(() => type),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
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
		isCombobox: true,
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
	{#each rootState.opts.value.current as item (item)}
		<ListboxHiddenInput value={item} />
	{/each}
{:else}
	<ListboxHiddenInput bind:value={rootState.opts.value.current as string} />
{/if}
