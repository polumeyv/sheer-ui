<script lang="ts">import { untrack } from "svelte";
	import { type WritableProp } from "$lib/vendor/index";
	import type { ComboboxRootProps } from "$lib/components/combobox/index";
	import FloatingLayer from "$lib/components/_shared/utilities/floating-layer/components/floating-layer.svelte";
	import { SelectRootState } from "$lib/components/combobox/primitive/select.svelte";
	import ListboxHiddenInput from "$lib/components/combobox/primitive/components/select-hidden-input.svelte";
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
		allowDeselect = true,
		inputValue = "",
		children,
	}: ComboboxRootProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		value = defaultValue;
	}

	$effect.pre(() => {
		void (value);
		untrack(() => {
			if (value !== undefined) return;
			value = type === "single" ? "" : [];
		});
	});

	const rootState = SelectRootState.create({
		type,
		value: { get current() { return value!; }, set current(v) {
        				value = v;
        				// @ts-expect-error - we know
        				onValueChange(v);
        			} } as WritableProp<string> | WritableProp<string[]>,
		disabled: { get current() { return disabled; } },
		required: { get current() { return required; } },
		open: { get current() { return open; }, set current(v) { open = v; onOpenChange(v); } },
		loop: { get current() { return loop; } },
		scrollAlignment: { get current() { return scrollAlignment; } },
		name: { get current() { return name; } },
		isCombobox: true,
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
	{#if rootState.opts.value.current.length}
		{#each rootState.opts.value.current as item (item)}
			<ListboxHiddenInput value={item} />
		{/each}
	{/if}
{:else}
	<ListboxHiddenInput bind:value={rootState.opts.value.current as string} />
{/if}
