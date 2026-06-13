<script lang="ts">
	import { TimeFieldHiddenInputState } from "$lib/components/time-field/time-field.svelte.js";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	const hiddenInputState = TimeFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
