<script lang="ts">
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";
	import { RadioGroupInputState } from "$lib/components/radio-group/primitive/radio-group.svelte.js";

	const inputState = RadioGroupInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
