<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { ContextMenuTriggerProps } from '../types.js';
	import { ContextMenuTriggerState } from '$lib/components/menu/menu.svelte.js';
	import { useId } from '$lib/internal/use-id.js';
	import { FloatingLayer } from '$lib/components/utilities/floating-layer/index.js';

	let { id = useId(), ref = $bindable(null), child, children, disabled = false, ...restProps }: ContextMenuTriggerProps = $props();

	const triggerState = ContextMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'context-menu-trigger',
			},
			restProps,
			triggerState.props,
			{ style: { pointerEvents: 'auto' } },
			{
				style: restProps.style,
				tabindex: restProps.tabindex,
			},
		),
	);
</script>

<FloatingLayer.Anchor {id} virtualEl={triggerState.virtualElement} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer.Anchor>
