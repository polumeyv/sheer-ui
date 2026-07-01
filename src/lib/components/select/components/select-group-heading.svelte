<script lang="ts">
	import { join } from 'overrule';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import type { SelectGroupHeadingProps } from '../types.js';
	import { SelectGroupHeadingState } from '../select.svelte.js';

	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		child,
		children,
		...restProps
	}: SelectGroupHeadingProps & {
		class?: string;
	} = $props();

	const groupHeadingState = SelectGroupHeadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'select-group-heading',
				class: join('px-2 py-1.5 text-xs text-muted-foreground', className),
			},
			groupHeadingState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
