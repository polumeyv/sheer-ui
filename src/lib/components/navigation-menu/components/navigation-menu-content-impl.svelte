<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { untrack, type Snippet } from 'svelte';
	import type { NavigationMenuContentProps } from '../types.js';
	import { setNavigationMenuItem, NavigationMenuItemState, NavigationMenuContentImplState } from '../navigation-menu.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { interactOutsideAttachment } from '../../../internal/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '../../../internal/escape-layer/use-escape-layer.svelte.js';

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
		child?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
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
		enabled: () => contentImplState.open,
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
		enabled: () => contentImplState.open,
	});
</script>

{#if childProp}
	{@render childProp({ props: mergeProps(mergedProps, dismissible.props, dismissible.attachment, escapeAttachment), open: contentImplState.open })}
{:else}
	<div {...mergeProps(mergedProps, dismissible.props, dismissible.attachment, escapeAttachment)}>
		{@render childrenProp?.()}
	</div>
{/if}
