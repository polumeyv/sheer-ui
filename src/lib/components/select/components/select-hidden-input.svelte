<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { SelectHiddenInputState } from '../select.svelte.js';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import HiddenInput from '../../utilities/hidden-input.svelte';

	let { value = $bindable(), autocomplete }: { value?: string } & Omit<HTMLInputAttributes, 'value'> = $props();

	const hiddenInputState = SelectHiddenInputState.create({
		value: boxWith(() => value),
	});
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} bind:value {autocomplete} />
{/if}
