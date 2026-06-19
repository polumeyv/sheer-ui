<script lang="ts">
	import { CheckboxInputState } from "../checkbox.svelte.js";
	import HiddenInput from "$lib/components/utilities/hidden-input.svelte";

	const inputState = CheckboxInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}