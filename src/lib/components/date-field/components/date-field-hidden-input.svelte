<script lang="ts">
	import { DateFieldHiddenInputState } from "$lib/components/date-field/date-field.svelte";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	const hiddenInputState = DateFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} />
{/if}
