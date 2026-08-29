<script lang="ts">
	import { attachRef, boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenubarTriggerProps } from '../types.js';
	import { MenubarTriggerState } from '../menubar.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { floatingAnchor } from '../../../internal/floating-layer/index.js';
	import { DropdownMenuTriggerState } from '../../menu/menu.svelte.js';

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
					'focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground flex items-center rounded-md px-2 py-1 text-sm font-medium outline-hidden select-none',
			},
			restProps,
			triggerState.props,
			{
				...triggerAttachment,
			},
		),
	);

	const anchor = floatingAnchor();
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, anchor) })}
{:else}
	<button {...mergeProps(mergedProps, anchor)}>
		{@render children?.()}
	</button>
{/if}
