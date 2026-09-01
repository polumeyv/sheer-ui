<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import type { MenubarContentProps } from '../types.js';
	import { MenubarContentState } from '../menubar.svelte.js';
	import MenuContent from '../../menu/components/menu-content.svelte';
	import { createId } from '../../../internal/create-id.js';
	import { getFloatingContentCSSVars } from '../../../internal/floating-layer/index.js';

	const uid = $props.id();

	let {
		ref = $bindable(null),
		interactOutsideBehavior = 'close',
		id = createId(uid),
		sideOffset = 8,
		alignOffset = -4,
		align = 'start',
		side = 'bottom',
		onInteractOutside = () => {},
		onFocusOutside = () => {},
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		...restProps
	}: MenubarContentProps = $props();

	const contentState = MenubarContentState.create({
		id: boxWith(() => id),
		interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		onInteractOutside: boxWith(() => onInteractOutside),
		onFocusOutside: boxWith(() => onFocusOutside),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
	});

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'menubar-content',
				class:
					'bg-popover text-popover-foreground popup-surface z-50 min-w-48 origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md outline-none',
				style: getFloatingContentCSSVars('menu'),
			},
			restProps,
			contentState.props,
		),
	);
</script>

<MenuContent bind:ref {...mergedProps} {...contentState.popperProps} {sideOffset} {alignOffset} {align} {side} preventScroll={false} />
