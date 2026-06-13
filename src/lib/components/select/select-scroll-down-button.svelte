<script lang="ts">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { SelectScrollDownButtonProps } from '$lib/bits/select/types.js';
	import { SelectScrollDownButtonState } from '$lib/bits/select/select.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { Mounted } from '$lib/bits/utilities/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { cn } from '../../utils';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		delay = () => 50,
		child,
		children,
		class: className,
		...restProps
	}: SelectScrollDownButtonProps = $props();

	const scrollButtonState = SelectScrollDownButtonState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		delay: boxWith(() => delay),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'select-scroll-down-button',
				class: cn('flex cursor-default items-center justify-center py-1', className),
			},
			restProps,
			scrollButtonState.props
		)
	);
</script>

{#if scrollButtonState.canScrollDown}
	<Mounted bind:mounted={scrollButtonState.scrollButtonState.mounted} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
			<ChevronDownIcon class="size-4" />
		</div>
	{/if}
{/if}
