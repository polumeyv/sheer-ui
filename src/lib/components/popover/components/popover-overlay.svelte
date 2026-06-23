<script lang="ts">
	import type { PopoverTriggerProps } from '../types.js';
	import { PopoverTriggerState } from '../popover.svelte.js';

	import FloatingLayerAnchor from '../../utilities/floating-layer/components/floating-layer-anchor.svelte';

	import { createId } from '$lib/internal/create-id.js';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { cn } from '$lib/utils.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		class: className,
		type = 'button',
		disabled = false,
		openOnHover = false,
		openDelay = 700,
		closeDelay = 300,
		...restProps
	}: PopoverTriggerProps & {
		class?: string;
	} = $props();

	const triggerState = PopoverTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(value) => (ref = value),
		),
		disabled: boxWith(() => Boolean(disabled)),
		openOnHover: boxWith(() => openOnHover),
		openDelay: boxWith(() => openDelay),
		closeDelay: boxWith(() => closeDelay),
	});

	const mergedProps = $derived(
		mergeProps(
			restProps,
			{
				'data-slot': 'popover-trigger',
				class: cn('', className),
			},
			triggerState.props,
			{ type },
		),
	);
</script>

<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayerAnchor>
