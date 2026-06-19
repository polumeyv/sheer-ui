<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { MenuSubTriggerProps } from "../types.js";
	import { MenuSubTriggerState } from "../menu.svelte.js";
	import FloatingLayerAnchor from "$lib/components/utilities/floating-layer/components/floating-layer-anchor.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		ref = $bindable(null),
		children,
		child,
		onSelect = () => {},
		openDelay = 0,
		inset,
		...restProps
	}: MenuSubTriggerProps & {
		inset?: boolean;
	} = $props();

	const subTriggerState = MenuSubTriggerState.create({
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => onSelect),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		openDelay: boxWith(() => openDelay),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				"data-slot": "dropdown-menu-sub-trigger",
				"data-inset": inset,
				class: "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			},
			restProps,
			subTriggerState.props
		)
	);
</script>

<FloatingLayerAnchor {id} ref={subTriggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
			<ChevronRightIcon class="ms-auto size-4" />
		</div>
	{/if}
</FloatingLayerAnchor>
