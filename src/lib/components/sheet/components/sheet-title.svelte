<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { DialogTitleState } from '../../../components/dialog/dialog.svelte.js';
	import type { DialogTitleProps } from '../../../components/dialog/types.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let { id = createId(uid), ref = $bindable(null), child, children, level = 2, ...restProps }: DialogTitleProps = $props();

	const titleState = DialogTitleState.create({
		id: boxWith(() => id),
		level: boxWith(() => level),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'sheet-title', class: 'text-foreground font-semibold' }, restProps, titleState.props),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
