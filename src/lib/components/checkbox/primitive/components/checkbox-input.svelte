<script lang="ts">
	import { CheckboxInputState } from "$lib/components/checkbox/primitive/checkbox.svelte";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	const inputState = CheckboxInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
