<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { SelectHiddenInputState } from '../select.svelte.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), autocomplete }: { value?: string } & Omit<HTMLInputAttributes, 'value'> = $props();

	const hiddenInputState = SelectHiddenInputState.create({
		value: boxWith(() => value),
	});
</script>

{#if hiddenInputState.shouldRender}
	<input {...hiddenInputState.props} bind:value {autocomplete} class="sr-only" aria-hidden="true" tabindex={-1} />
{/if}
s