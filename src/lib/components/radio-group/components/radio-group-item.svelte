<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { RadioGroupItemProps } from '../types.js';
	import { RadioGroupItemState } from '../radio-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import CircleIcon from '@lucide/svelte/icons/circle';

	const uid = $props.id();

	let { id = createId(uid), children, child, value, disabled = false, ref = $bindable(null), ...restProps }: RadioGroupItemProps = $props();

	const itemState = RadioGroupItemState.create({
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'radio-group-item',
				class:
					'border-border text-primary border focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-border/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			},
			restProps,
			itemState.props,
		),
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...itemState.snippetProps })}
{:else}
	<button {...mergedProps}>
		<div data-slot="radio-group-indicator" class="relative grid place-items-center">
			{#if itemState.snippetProps.checked}
				<CircleIcon class="fill-primary absolute inset-s-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
			{/if}
		</div>
		{@render children?.(itemState.snippetProps)}
	</button>
{/if}
