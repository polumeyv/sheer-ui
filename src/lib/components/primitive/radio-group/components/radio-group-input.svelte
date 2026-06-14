<script lang="ts">
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";
	import { RadioGroupInputState } from "$lib/components/primitive/radio-group/radio-group.svelte";

	const inputState = RadioGroupInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
