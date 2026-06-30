<script lang="ts">
	import { TimeFieldHiddenInputState } from "../time-field.svelte.js";

	const hiddenInputState = TimeFieldHiddenInputState.create();
</script>

{#if hiddenInputState.shouldRender}
	<input {...hiddenInputState.props} class="sr-only" aria-hidden="true" tabindex={-1} />
{/if}
