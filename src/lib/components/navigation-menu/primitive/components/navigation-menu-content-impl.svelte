<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import { untrack, type Snippet } from "svelte";
	import type { NavigationMenuContentProps } from "$lib/components/navigation-menu/primitive/index.js";
	import {
		setNavigationMenuItemContext,
		NavigationMenuItemState,
		NavigationMenuContentImplState,
	} from "$lib/components/navigation-menu/primitive/navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import DismissibleLayer from "$lib/components/_shared/utilities/dismissible-layer/dismissible-layer.svelte";
	import EscapeLayer from "$lib/components/_shared/utilities/escape-layer/escape-layer.svelte";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child: childProp,
		children: childrenProp,
		onInteractOutside = (() => {}),
		onFocusOutside = (() => {}),
		onEscapeKeydown = (() => {}),
		escapeKeydownBehavior = "close",
		interactOutsideBehavior = "close",
		itemState,
		onRefChange,
		...restProps
	}: Omit<NavigationMenuContentProps, "child"> & {
		itemState?: NavigationMenuItemState;
		onRefChange?: (ref: HTMLElement | null) => void;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const contentImplState = NavigationMenuContentImplState.create(
		{
			id: boxWith(() => id),
			ref: boxWith(
				() => ref,
				(v) => {
					ref = v;
					untrack(() => onRefChange?.(v));
				}
			),
		},
		itemState
	);

	if (itemState) {
		setNavigationMenuItemContext(itemState);
	}

	const mergedProps = $derived(mergeProps(restProps, contentImplState.props));
</script>

<DismissibleLayer
	{id}
	ref={contentImplState.opts.ref}
	enabled={true}
	onInteractOutside={(e) => {
		onInteractOutside(e);
		if (e.defaultPrevented) return;
		contentImplState.onInteractOutside(e);
	}}
	onFocusOutside={(e) => {
		onFocusOutside(e);
		if (e.defaultPrevented) return;
		contentImplState.onFocusOutside(e);
	}}
	{interactOutsideBehavior}
>
	{#snippet children({ props: dismissibleProps })}
		<EscapeLayer
			enabled={true}
			ref={contentImplState.opts.ref}
			onEscapeKeydown={(e) => {
				onEscapeKeydown(e);
				if (e.defaultPrevented) return;
				contentImplState.onEscapeKeydown(e);
			}}
			{escapeKeydownBehavior}
		>
			{@const finalProps = mergeProps(mergedProps, dismissibleProps)}
			{#if childProp}
				{@render childProp({ props: finalProps })}
			{:else}
				<div {...finalProps}>
					{@render childrenProp?.()}
				</div>
			{/if}
		</EscapeLayer>
	{/snippet}
</DismissibleLayer>
