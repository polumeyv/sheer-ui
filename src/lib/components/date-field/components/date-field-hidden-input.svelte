<script lang="ts">
	import { DateFieldHiddenInputState } from "../date-field.svelte.js";

	const hiddenInputState = DateFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<input {...hiddenInputState.props} class="sr-only" aria-hidden="true" tabindex={-1} />
{/if}
