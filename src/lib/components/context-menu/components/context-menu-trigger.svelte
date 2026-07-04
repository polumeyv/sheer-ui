<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { ContextMenuTriggerProps } from '../types.js';
	import { ContextMenuTriggerState } from '../../menu/menu.svelte.js';
	import { useId } from '../../../internal/use-id.js';
	import { setFloatingAnchor } from '../../../internal/floating-layer/index.js';

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

	setFloatingAnchor(triggerState.virtualElement);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
