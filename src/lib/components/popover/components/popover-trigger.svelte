<script lang="ts">
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
		get id() {
			return id;
		},
		get disabled() {
			return Boolean(disabled);
		},
		get openOnHover() {
			return openOnHover;
		},
		get openDelay() {
			return openDelay;
		},
		get closeDelay() {
			return closeDelay;
		},
		get ref() {
			return ref;
		},
		set ref(v) {
			ref = v;
		},
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
