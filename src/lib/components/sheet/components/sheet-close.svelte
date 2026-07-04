<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogCloseState } from '../../dialog/dialog.svelte.js';
	import type { DialogCloseProps } from '../../dialog/types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { children, child, id = createId(uid), ref = $bindable(null), disabled = false, ...restProps }: DialogCloseProps = $props();

	const closeState = DialogCloseState.create({
		variant: boxWith(() => 'close'),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'sheet-close' }, restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
