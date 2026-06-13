<script lang="ts">
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";
	import { SwitchInputState } from "$lib/components/switch/primitive/switch.svelte.js";

	const inputState = SwitchInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
