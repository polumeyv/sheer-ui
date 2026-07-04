<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { PopoverTriggerProps } from '../types.js';
	import { PopoverTriggerState } from '../popover.svelte.js';
	import { createId } from '../../../internal/create-id.js';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		type = 'button',
		disabled = false,
		openOnHover = false,
		openDelay = 700,
		closeDelay = 300,
		...restProps
	}: PopoverTriggerProps = $props();

	const triggerState = PopoverTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		disabled: boxWith(() => Boolean(disabled)),
		openOnHover: boxWith(() => openOnHover),
		openDelay: boxWith(() => openDelay),
		closeDelay: boxWith(() => closeDelay),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'popover-trigger' }, restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
