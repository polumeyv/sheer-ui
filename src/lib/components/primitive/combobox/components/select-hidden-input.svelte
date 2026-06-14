<script lang="ts">
		import { SelectHiddenInputState } from "$lib/components/primitive/combobox/select.svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	let {
		value = $bindable(),
		autocomplete,
	}: { value?: string } & Omit<HTMLInputAttributes, "value"> = $props();

	const hiddenInputState = SelectHiddenInputState.create({
		value: { get current() { return value; } },
	});
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} bind:value {autocomplete} />
{/if}
