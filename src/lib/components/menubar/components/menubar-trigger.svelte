<script lang="ts">
	import { attachRef, boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import type { MenubarTriggerProps } from '../types.js';
	import { MenubarTriggerState } from '../menubar.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import FloatingLayerAnchor from '$lib/components/utilities/floating-layer/components/floating-layer-anchor.svelte';
	import { DropdownMenuTriggerState } from '$lib/components/menu/menu.svelte.js';

	const uid = $props.id();

	let { id = createId(uid), disabled = false, children, child, ref = $bindable(null), ...restProps }: MenubarTriggerProps = $props();

	const triggerState = MenubarTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const dropdownTriggerState = DropdownMenuTriggerState.create(triggerState.opts);
	const triggerAttachment = attachRef((v: HTMLElement | null) => (dropdownTriggerState.parentMenu.triggerNode = v));

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'menubar-trigger',
				class:
					'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-md px-2 py-1 text-sm font-medium outline-hidden select-none',
			},
			restProps,
			triggerState.props,
			{
				...triggerAttachment,
			},
		),
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
