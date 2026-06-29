<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { untrack, type Snippet } from 'svelte';
	import type { NavigationMenuContentProps } from '../types.js';
	import { setNavigationMenuItem, NavigationMenuItemState, NavigationMenuContentImplState } from '../navigation-menu.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import { interactOutsideAttachment } from '../../utilities/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '../../utilities/escape-layer/use-escape-layer.svelte.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child: childProp,
		children: childrenProp,
		onInteractOutside = () => {},
		onFocusOutside = () => {},
		onEscapeKeydown = () => {},
		escapeKeydownBehavior = 'close',
		interactOutsideBehavior = 'close',
		itemState,
		onRefChange,
		...restProps
	}: Omit<NavigationMenuContentProps, 'child'> & {
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
				},
			),
		},
		itemState,
	);

	if (itemState) {
		setNavigationMenuItem(itemState);
	}

	const mergedProps = $derived(mergeProps(restProps, contentImplState.props));

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => escapeKeydownBehavior,
		onEscapeKeydown: () => (e) => {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			contentImplState.onEscapeKeydown(e);
		},
		enabled: () => true,
	});

	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onInteractOutside: () => (e) => {
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			contentImplState.onInteractOutside(e);
		},
		onFocusOutside: () => (e) => {
			onFocusOutside(e);
			if (e.defaultPrevented) return;
			contentImplState.onFocusOutside(e);
		},
		enabled: () => true,
		isValidEvent: () => () => false,
	});
</script>

{#if childProp}
	{@render childProp({ props: mergeProps(mergedProps, dismissible.props, dismissible.attachment, escapeAttachment) })}
{:else}
	<div {...mergeProps(mergedProps, dismissible.props, dismissible.attachment, escapeAttachment)}>
		{@render childrenProp?.()}
	</div>
{/if}
