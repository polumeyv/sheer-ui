<script lang="ts" module>
	type T = unknown;
</script>

<script lang="ts" generics="T = never">
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { TooltipTriggerProps } from '../types.js';
	import { TooltipTriggerState } from '../tooltip.svelte.js';
	import { createId } from '../../../internal/create-id.js';

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
		get id() {
			return id;
		},
		get disabled() {
			return disabled ?? false;
		},
		get tabindex() {
			return tabindex ?? 0;
		},
		get payload() {
			return payload;
		},
		get tether() {
			return tether;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'tooltip-trigger' }, restProps, triggerState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
