<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';

	import type { SelectGroupHeadingProps } from '../types.js';
	import { SelectGroupHeadingState } from '../select.svelte.js';

	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		child,
		children,
		...restProps
	}: SelectGroupHeadingProps & {
		class?: ClassValue;
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
