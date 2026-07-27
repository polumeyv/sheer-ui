<script lang="ts">
	import { untrack } from 'svelte';
	import FloatingLayer from '../../../../internal/floating-layer/components/floating-layer.svelte';
	import { type WritableBox, boxWith, repairBindable } from '../../../../internal/tools/index.js';
	import { OpenCell } from '../../../../internal/open-cell.svelte.js';
	import { SelectRootState } from '../select.svelte.js';
	import type { SelectRootProps } from '../types.js';
	import SelectHiddenInput from './select-hidden-input.svelte';

	let {
		value = $bindable(),
		onValueChange = () => {},
		name = '',
		disabled = false,
		type,
		open = false,
		// `state` must not exist as a local name — it would shadow the `$state` rune below.
		state: givenCell,
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

	// Root owns both the machinery and the cell; `open` (the prop) is the cell's
	// derivation source, and the children snippet is the only way the cell leaves.
	// A caller-built `state` cell (with its own source/writer) takes over both roles.
	// The cell's identity is fixed at mount — swapping `state` later is not supported.
	// The engine keeps its boxed-open interface (vendored, ADR 0006); the box is a
	// bridge over the cell, so the cell stays the one owner of `open`.
	// svelte-ignore state_referenced_locally
	const select = givenCell ?? new OpenCell(() => open);

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
			() => select.open,
			(v) => (select.open = v),
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
	{@render children?.(select)}
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
