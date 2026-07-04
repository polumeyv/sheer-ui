<script lang="ts">
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../merge-props.js';
	import { DialogContentState } from '../dialog.svelte.js';
	import type { DialogContentProps } from '../types.js';
	import { interactOutsideAttachment } from '../../utilities/dismissible-layer/use-dismissable-layer.svelte.js';
	import { escapeKeydownAttachment } from '../../utilities/escape-layer/use-escape-layer.svelte.js';
	import { createFocusScopeProps } from '../../utilities/focus-scope/focus-scope.svelte.js';
	import { textSelectionAttachment } from '../../utilities/text-selection-layer/use-text-selection-layer.svelte.js';
	import { createId } from '../../../internal/create-id.js';
	import ScrollLock from '../../utilities/scroll-lock/scroll-lock.svelte';

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

	const focusScope = createFocusScopeProps({
		enabled: () => contentState.root.cell.open,
		trap: () => trapFocus,
		loop: () => true,
		onCloseAutoFocus: () => onCloseAutoFocus,
		onOpenAutoFocus: () => onOpenAutoFocus,
	});
</script>

{#if contentState.shouldRender || forceMount}
	{#if child}
		{#if contentState.root.cell.open}
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
		</div>
	{/if}
{/if}
