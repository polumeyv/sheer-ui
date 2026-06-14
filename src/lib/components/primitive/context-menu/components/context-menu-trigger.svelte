<script lang="ts">
	import { mergeProps } from '$lib/merge-props';
	import type { ContextMenuTriggerProps } from "$lib/components/primitive/context-menu/index";
	import { ContextMenuTriggerState } from "$lib/components/_shared/menu/trigger.svelte";
	import { useId } from "$lib/vendor/use-id";
	import { FloatingLayer } from "$lib/components/_shared/utilities/floating-layer/index";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: ContextMenuTriggerProps = $props();

	const triggerState = ContextMenuTriggerState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
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
