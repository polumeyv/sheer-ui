<script lang="ts" module>
	import { sheetVariants, type Side } from '$lib/components/sheet/variants.js';
	export { sheetVariants, type Side };
</script>

<script lang="ts">
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { DialogContentState } from '$lib/components/dialog/dialog.svelte.js';
	import type { DialogContentProps, DialogPortalProps } from '$lib/components/dialog/types.js';
	import { interactOutsideAttachment } from '$lib/components/utilities/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '$lib/components/utilities/escape-layer/use-escape-layer.svelte.js';
	import { FocusScope } from '$lib/components/utilities/focus-scope/focus-scope.svelte.js';
	import { textSelectionAttachment } from '$lib/components/utilities/text-selection-layer/use-text-selection-layer.svelte.js';
	import { createId } from '$lib/internal/create-id.js';
	import ScrollLock from '$lib/components/utilities/scroll-lock/scroll-lock.svelte';
	import Portal from '$lib/components/utilities/portal/portal.svelte';
	import SheetOverlay from './sheet-overlay.svelte';
	import SheetClose from './sheet-close.svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import type { WithoutChildrenOrChild } from '$lib/utils.js';

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		side = 'right',
		forceMount = false,
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		onEscapeKeydown = () => {},
		onInteractOutside = () => {},
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		portalProps,
		...restProps
	}: DialogContentProps & {
		side?: Side;
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	const mergedProps = $derived(mergeProps({ 'data-slot': 'sheet-content', class: sheetVariants({ side }) }, restProps, contentState.props));

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => restProps.escapeKeydownBehavior ?? 'close',
		onEscapeKeydown: () => (e) => {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		enabled: () => contentState.root.opts.open.current,
	});

	// Sheet content drops the dismissible focus-capture props (default-slot usage), so only
	// `dismissible.attachment` is merged below.
	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => restProps.interactOutsideBehavior ?? 'close',
		onInteractOutside: () => (e) => {
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		onFocusOutside: () => restProps.onFocusOutside ?? (() => {}),
		enabled: () => contentState.root.opts.open.current,
		isValidEvent: () => () => false,
	});

	const textSelection = textSelectionAttachment({
		id: () => id,
		onPointerDown: () => () => {},
		onPointerUp: () => () => {},
		enabled: () => contentState.root.opts.open.current && (restProps.preventOverflowTextSelection ?? true),
	});

	const focusScope = FocusScope.use({
		enabled: boxWith(() => contentState.root.opts.open.current),
		trap: boxWith(() => trapFocus),
		loop: true,
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		ref: contentState.opts.ref,
	});
</script>

<Portal {...portalProps}>
	<SheetOverlay />
	{#if contentState.shouldRender || forceMount}
		{#if child}
			{#if contentState.root.opts.open.current}
				<ScrollLock {preventScroll} {restoreScrollDelay} />
			{/if}
			{@render child({
				props: mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection),
				...contentState.snippetProps,
			})}
		{:else}
			<ScrollLock {preventScroll} />
			<div {...mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection)}>
				{@render children?.()}
				<SheetClose
					class="ring-offset-background focus-visible:ring-ring absolute inset-e-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none">
					<XIcon class="size-4" />
					<span class="sr-only">Close</span>
				</SheetClose>
			</div>
		{/if}
	{/if}
</Portal>
