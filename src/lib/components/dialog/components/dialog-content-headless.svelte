<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogContentState } from '../dialog.svelte.js';
	import type { DialogContentProps } from '../types.js';
	import { interactOutsideAttachment } from '../../../internal/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '../../../internal/escape-layer/use-escape-layer.svelte.js';
	import { createFocusScopeProps } from '../../../internal/focus-scope/focus-scope.svelte.js';
	import { textSelectionAttachment } from '../../../internal/text-selection-layer/use-text-selection-layer.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import { scrollLockAttachment } from '../../../internal/body-scroll-lock.svelte.js';
	import { PresenceManager } from '../../../internal/presence-manager.svelte.js';

	/**
	 * Headless JS-overlay dialog content — a presence-gated <div> with the FocusScope / EscapeLayer /
	 * DismissibleLayer / ScrollLock stack. The public Dialog.Content is now the native <dialog>
	 * (dialog-content.svelte); this variant survives ONLY for the Drawer, whose vaul drag physics need a
	 * draggable in-flow <div> and cannot live in the top layer. Keep in sync with the shared Dialog state
	 * cell — it is the same DialogContentState, just rendered as a div instead of a modal <dialog>.
	 */
	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		forceMount = false,
		onCloseAutoFocus = () => {},
		onOpenAutoFocus = () => {},
		onEscapeKeydown = () => {},
		onInteractOutside = () => {},
		trapFocus = true,
		preventScroll = true,
		restoreScrollDelay = null,
		...restProps
	}: DialogContentProps = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// Mount gate rides shouldRender, not `open`: it flips a flush later, so vaul's
	// open-effect snapshots body styles before the scroll lock applies, and the root's
	// completion watcher sees no contentNode at the open flip (drawer parity).
	const presence = new PresenceManager({
		ref: boxWith(() => ref),
		open: boxWith(() => contentState.root.cell.open),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));

	const escapeAttachment = escapeKeydownAttachment({
		escapeKeydownBehavior: () => restProps.escapeKeydownBehavior ?? 'close',
		onEscapeKeydown: () => (e) => {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		enabled: () => contentState.root.cell.open,
	});

	// Dialog content historically dropped the dismissible focus-capture props (its default-slot
	// usage never threaded them), so only `dismissible.attachment` is merged below.
	const dismissible = interactOutsideAttachment({
		id: () => id,
		interactOutsideBehavior: () => restProps.interactOutsideBehavior ?? 'close',
		onInteractOutside: () => (e) => {
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			contentState.root.handleClose();
		},
		onFocusOutside: () => restProps.onFocusOutside ?? (() => {}),
		enabled: () => contentState.root.cell.open,
		isValidEvent: () => () => false,
	});

	const textSelection = textSelectionAttachment({
		id: () => id,
		onPointerDown: () => () => {},
		onPointerUp: () => () => {},
		enabled: () => contentState.root.cell.open && (restProps.preventOverflowTextSelection ?? true),
	});

	// Rides the content element, so the lock spans the presence window (mount through exit
	// animation) on both render paths — restoreScrollDelay covers the scrollbar restore.
	const scrollLock = scrollLockAttachment({
		enabled: () => preventScroll,
		restoreScrollDelay: () => restoreScrollDelay,
	});

	const focusScope = createFocusScopeProps({
		enabled: () => contentState.root.cell.open,
		trap: () => trapFocus,
		loop: () => true,
		onCloseAutoFocus: () => onCloseAutoFocus,
		onOpenAutoFocus: () => onOpenAutoFocus,
	});
</script>

{#if presence.shouldRender || forceMount}
	{#if child}
		{@render child({
			props: mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection, scrollLock),
			...contentState.snippetProps,
		})}
	{:else}
		<div {...mergeProps(mergedProps, focusScope.props, escapeAttachment, dismissible.attachment, textSelection, scrollLock)}>
			{@render children?.()}
		</div>
	{/if}
{/if}
