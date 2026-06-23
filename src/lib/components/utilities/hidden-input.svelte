<script lang="ts">
	import { srOnlyStyles } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), ...restProps }: HTMLInputAttributes = $props();

	const mergedProps = $derived(
		mergeProps(restProps, {
			'aria-hidden': 'true',
			tabindex: -1,
			style: {
				...srOnlyStyles,
				position: 'absolute',
				top: '0',
				left: '0',
			},
		}),
	);
</script>

{#if mergedProps.type === 'checkbox'}
	<input {...mergedProps} {value} />
{:else}
	<input bind:value {...mergedProps} />
{/if}
