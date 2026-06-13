<script lang="ts">
	import { boxWith } from "$lib/vendor/toolbelt/index.js";
	import { SelectHiddenInputState } from "$lib/components/select/primitive/select.svelte.js";
	import type { HTMLInputAttributes } from "svelte/elements";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	let {
		value = $bindable(),
		autocomplete,
	}: { value?: string } & Omit<HTMLInputAttributes, "value"> = $props();

	const hiddenInputState = SelectHiddenInputState.create({
		value: boxWith(() => value),
	});
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} bind:value {autocomplete} />
{/if}
