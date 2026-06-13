<script lang="ts">
	import FloatingLayer from '$lib/bits/utilities/floating-layer/components/floating-layer.svelte';
	import { noop } from '$lib/internal/noop.js';
	import { type WritableBox, boxWith } from '$lib/vendor/toolbelt/index.js';
	import { SelectRootState } from '$lib/bits/select/select.svelte.js';
	import type { SelectRootProps } from '$lib/bits/select/types.js';
	import SelectHiddenInput from '$lib/bits/select/components/select-hidden-input.svelte';
	import { watch } from '$lib/vendor/runed/index.js';

	let {
		value = $bindable(),
		onValueChange = noop,
		name = '',
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		loop = false,
		scrollAlignment = 'nearest',
		required = false,
		items = [],
		allowDeselect = false,
		autocomplete,
		children,
	}: SelectRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === 'single' ? '' : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	let inputValue = $state('');

	const rootState = SelectRootState.create({
		type,
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: boxWith(() => disabled),
		required: boxWith(() => required),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		loop: boxWith(() => loop),
		scrollAlignment: boxWith(() => scrollAlignment),
		name: boxWith(() => name),
		isCombobox: false,
		items: boxWith(() => items),
		allowDeselect: boxWith(() => allowDeselect),
		inputValue: boxWith(
			() => inputValue,
			(v) => (inputValue = v)
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
