<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
	import { mergeProps } from '$lib/merge-props';
	import type { TooltipTriggerProps } from '$lib/components/primitive/tooltip/index';
	import { TooltipTriggerState } from '$lib/components/primitive/tooltip/tooltip.svelte';
	import { createId } from '$lib/vendor/create-id';

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		disabled = false,
		payload,
		tether,
		type = 'button',
		tabindex = 0,
		ref = $bindable(null),
		...restProps
	}: TooltipTriggerProps<T> = $props();

	const triggerState = TooltipTriggerState.create({
		id: { get current() { return id; } },
		disabled: { get current() { return disabled ?? false; } },
		tabindex: { get current() { return tabindex ?? 0; } },
		payload: { get current() { return payload; } },
		tether: { get current() { return tether; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'tooltip-trigger' }, restProps, triggerState.props, { type }),
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
