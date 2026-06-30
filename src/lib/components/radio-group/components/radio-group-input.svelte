<script lang="ts">
	import { RadioGroupInputState } from '../radio-group.svelte.js';

	const inputState = RadioGroupInputState.create();
</script>

{#if inputState.shouldRender}
	<input {...inputState.props} class="sr-only" aria-hidden="true" tabindex={-1} />
{/if}
