<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { DialogDescriptionState } from '../../../components/dialog/dialog.svelte.js';
	import type { DialogDescriptionProps } from '../../../components/dialog/types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), children, child, ref = $bindable(null), ...restProps }: DialogDescriptionProps = $props();

	const descriptionState = DialogDescriptionState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'sheet-description', class: 'text-muted-foreground text-sm' }, restProps, descriptionState.props),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
