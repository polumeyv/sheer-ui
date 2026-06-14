<script lang="ts">import { untrack } from "svelte";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { type WritableProp } from "$lib/vendor/index";
	import { SelectRootState } from "$lib/components/combobox/primitive/select.svelte";
	import type { SelectRootProps } from "$lib/components/combobox/primitive/index";
	import SelectHiddenInput from "$lib/components/combobox/primitive/components/select-hidden-input.svelte";
	let {
		value = $bindable(),
		onValueChange = (() => {}),
		name = "",
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = (() => {}),
		onOpenChangeComplete = (() => {}),
		loop = false,
		scrollAlignment = "nearest",
		required = false,
		items = [],
		allowDeselect = false,
		autocomplete,
		children,
	}: SelectRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? "" : [];
	}

	// SSR
	handleDefaultValue();

	$effect.pre(() => {
		void (value);
		untrack(() => {
			handleDefaultValue();
		});
	});

	let inputValue = $state("");

	const rootState = SelectRootState.create({
		type,
		value: { get current() { return value!; }, set current(v) {
        				value = v;
        				// oxlint-disable-next-line no-explicit-any
        				onValueChange(v as any);
        			} } as WritableProp<string> | WritableProp<string[]>,
		disabled: { get current() { return disabled; } },
		required: { get current() { return required; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		loop: { get current() { return loop; } },
		scrollAlignment: { get current() { return scrollAlignment; } },
		name: { get current() { return name; } },
		isCombobox: false,
		items: { get current() { return items; } },
		allowDeselect: { get current() { return allowDeselect; } },
		inputValue: { get current() { return inputValue; }, set current(v) { (inputValue = v); } },
		onOpenChangeComplete: { get current() { return onOpenChangeComplete; } },
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
