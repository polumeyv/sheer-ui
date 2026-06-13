<script lang="ts">
	import { RatingGroupHiddenInputState } from "$lib/components/rating-group/rating-group.svelte.js";
	import HiddenInput from "$lib/components/_shared/utilities/hidden-input.svelte";

	const inputState = RatingGroupHiddenInputState.create();
</script>

{#if inputState.shouldRender}
	<HiddenInput {...inputState.props} />
{/if}
