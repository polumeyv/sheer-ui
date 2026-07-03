<script lang="ts">
	import { join } from 'overrule';
	import type { ClassValue } from 'svelte/elements';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';

	import { SelectGroupState } from '../select.svelte.js';
	import type { SelectGroupProps } from '../types.js';

	import { createId } from '$lib/internal/create-id.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		children,
		child,
		...restProps
	}: SelectGroupProps & {
		class?: ClassValue;
	} = $props();

	const groupState = SelectGroupState.create({
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
				'data-slot': 'select-group',
				class: join('scroll-my-1 p-1', className),
			},
			groupState.props,
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
