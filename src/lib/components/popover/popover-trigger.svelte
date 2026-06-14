<script lang="ts">
	import { mergeProps } from '$lib/vendor/index';
	import type { PopoverTriggerProps } from '$lib/components/popover/primitive/index';
	import { PopoverTriggerState } from '$lib/components/popover/primitive/popover.svelte';
	import { createId } from '$lib/vendor/create-id';
	import FloatingLayerAnchor from '$lib/components/_shared/utilities/floating-layer/components/floating-layer-anchor.svelte';
	import { cn } from '../../vendor/utils';

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
	}: PopoverTriggerProps = $props();

	const triggerState = PopoverTriggerState.create({
		id: {
			get current() {
				return id;
			},
		},
		ref: {
			get current() {
				return ref;
			},
			set current(v) {
				ref = v;
			},
		},
		disabled: {
			get current() {
				return Boolean(disabled);
			},
		},
		openOnHover: {
			get current() {
				return openOnHover;
			},
		},
		openDelay: {
			get current() {
				return openDelay;
			},
		},
		closeDelay: {
			get current() {
				return closeDelay;
			},
		},
	});

	const mergedProps = $derived(
		mergeProps({ 'data-slot': 'popover-trigger', class: cn('', className) }, restProps, triggerState.props, { type }),
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
