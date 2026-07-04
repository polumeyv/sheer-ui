<script lang="ts">
	import { join } from 'overrule';
	// Vaul's drag physics need an in-flow, draggable <div>, not a top-layer native <dialog> — so the
	// drawer keeps the headless JS-overlay content (the public Dialog.Content is now a native <dialog>).
	import DialogContentHeadless from '../dialog/components/dialog-content-headless.svelte';
	import { type WithChildren, boxWith } from '../../internal/tools/index.js';
	import { mergeProps } from '../../internal/merge-props.js';
	import type { ComponentProps } from 'svelte';
	import type { WithoutChildrenOrChild } from '../../internal/utils.js';
	import { useId } from '../../internal/use-id.js';
	import DrawerPortal from './drawer-portal.svelte';
	import DrawerOverlay from './drawer-overlay.svelte';
	import { noop } from '@polumeyv/utilities';
	import { useDrawerContent } from '../../internal/vendor/vaul/use-drawer-content.svelte.js';
	import type { ContentProps } from '../../internal/vendor/vaul/components/drawer/index.js';

	let {
		id = useId(),
		ref = $bindable(null),
		class: className,
		portalProps,
		onOpenAutoFocus = noop,
		onInteractOutside = noop,
		onFocusOutside = noop,
		oncontextmenu = noop,
		onpointerdown = noop,
		onpointerup = noop,
		onpointerout = noop,
		onpointermove = noop,
		children,
		...restProps
	}: WithChildren<WithoutChildrenOrChild<ContentProps>> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DrawerPortal>>;
	} = $props();

	const contentState = useDrawerContent({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
		oncontextmenu: boxWith(() => oncontextmenu ?? noop),
		onInteractOutside: boxWith(() => onInteractOutside),
		onpointerdown: boxWith(() => onpointerdown ?? noop),
		onpointermove: boxWith(() => onpointermove ?? noop),
		onpointerout: boxWith(() => onpointerout ?? noop),
		onpointerup: boxWith(() => onpointerup ?? noop),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		onFocusOutside: boxWith(() => onFocusOutside),
	});

	const snapPointsOffset = $state.snapshot(contentState.ctx.snapPointsOffset);

	const styleProp = $derived(
		snapPointsOffset && snapPointsOffset.length > 0
			? {
					'--snap-point-height': `${snapPointsOffset[contentState.ctx.activeSnapPointIndex ?? 0]}px`,
				}
			: {},
	);

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'drawer-content',
				class: join(
					'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
					'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
					'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
					'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:inset-e-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-s data-[vaul-drawer-direction=right]:sm:max-w-sm',
					'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:inset-s-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-e data-[vaul-drawer-direction=left]:sm:max-w-sm',
					className,
				),
			},
			restProps,
			contentState.props,
			{ style: styleProp },
		),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) as any;
</script>

<DrawerPortal {...portalProps}>
	<DrawerOverlay />
	<DialogContentHeadless {...mergedProps}>
		<div class="bg-muted mx-auto mt-4 hidden h-2 w-25 shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block">
		</div>
		{@render children?.()}
	</DialogContentHeadless>
</DrawerPortal>
