<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { AlertDialogCancelProps } from '../types.js';
	import { AlertDialogCancelState } from '$lib/components/dialog/dialog.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { buttonVariants } from '$lib/components/button/variants.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), children, child, disabled = false, ...restProps }: AlertDialogCancelProps = $props();

	const cancelState = AlertDialogCancelState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'alert-dialog-cancel', class: buttonVariants({ variant: 'outline' }) }, restProps, cancelState.props),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
