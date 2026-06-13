<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { RadioGroupItemProps } from '$lib/components/radio-group/primitive/types.js';
	import { RadioGroupItemState } from '$lib/components/radio-group/primitive/radio-group.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import { cn, type WithoutChildrenOrChild } from '../../utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		value,
		disabled = false,
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupItemProps> = $props();

	const itemState = RadioGroupItemState.create({
		value: boxWith(() => value),
		disabled: boxWith(() => disabled ?? false),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'radio-group-item',
				class: cn(
					'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					className
				),
			},
			restProps,
			itemState.props
		)
	);
</script>

<button {...mergedProps}>
	<div data-slot="radio-group-indicator" class="relative flex items-center justify-center">
		{#if itemState.snippetProps.checked}
			<CircleIcon
				class="fill-primary absolute inset-s-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
			/>
		{/if}
	</div>
</button>
