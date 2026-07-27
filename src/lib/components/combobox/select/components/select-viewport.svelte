<script lang="ts">
	import { boxWith } from '../../../../internal/tools/index.js';
	import { mergeProps } from '../../../../internal/merge-props.js';
	import type { SelectViewportProps } from '../types.js';
	import { SelectViewportState } from '../select.svelte.js';
	import { createId } from '../../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, ...restProps }: SelectViewportProps = $props();

	const viewportState = SelectViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<style>
	/* Hide scrollbars cross browser */
	:global([data-select-viewport]) {
		scrollbar-width: none !important;
	}

	:global([data-combobox-viewport]) {
		scrollbar-width: none !important;
	}

	:global([data-combobox-viewport])::-webkit-scrollbar {
		display: none !important;
	}
	:global([data-select-viewport])::-webkit-scrollbar {
		display: none !important;
	}
</style>
