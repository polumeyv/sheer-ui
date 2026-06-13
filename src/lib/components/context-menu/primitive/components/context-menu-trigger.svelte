<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { ContextMenuTriggerProps } from "$lib/components/context-menu/primitive/index.js";
	import { ContextMenuTriggerState } from "$lib/components/_shared/menu/menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: ContextMenuTriggerProps = $props();

	const triggerState = ContextMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(
			restProps,
			triggerState.props,
			{ style: { pointerEvents: "auto" } },
			{
				style: restProps.style,
				tabindex: restProps.tabindex,
			}
		)
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
