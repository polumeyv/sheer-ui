<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
	import { boxWith, mergeProps } from '$lib/vendor/toolbelt/index.js';
	import type { TooltipTriggerProps } from '$lib/bits/tooltip/types.js';
	import { TooltipTriggerState } from '$lib/bits/tooltip/tooltip.svelte.js';
	import { createId } from '$lib/internal/create-id.js';

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
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		tabindex: boxWith(() => tabindex ?? 0),
		payload: boxWith(() => payload),
		tether: boxWith(() => tether),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
