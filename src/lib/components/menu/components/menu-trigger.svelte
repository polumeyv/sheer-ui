<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenuTriggerProps } from '../types.js';
	import { DropdownMenuTriggerState } from '../menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { floatingAnchor } from '../../../internal/floating-layer/index.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		type = 'button',
		...restProps
	}: MenuTriggerProps = $props();

	const triggerState = DropdownMenuTriggerState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dropdown-menu-trigger',
			},
			restProps,
			triggerState.props,
			{ type },
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
