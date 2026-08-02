<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { boxWith } from '../../../internal/tools/index.js';
	import { mergeProps } from '../../../internal/merge-props.js';
	import { DialogContentState } from '../dialog.svelte.js';
	import type { DialogContentProps, DialogPortalProps } from '../types.js';
	import { createId } from '../../../internal/create-id.js';
	import type { WithoutChildrenOrChild } from '../../../internal/utils.js';
	import { scrollLockAttachment } from '../../../internal/body-scroll-lock.svelte.js';
	import { nativeDialogControllerAttachment } from '../../../internal/native-dialog-controller.svelte.js';

	/**
	 * The native modal surface: the one skeleton behind every modal `<dialog>` adapter
	 * (Dialog.Content, Sheet.Content). Owns what the adapters used to copy — the parity
	 * prop block, the content state, the controller attachment, the scroll lock, and the
	 * `<dialog>` render + attribute cast. Adapters supply only their visual policy:
	 * `class`, an `outsideEvent` override, and their inner markup.
	 *
	 * What native + CSS absorb, replacing the old JS overlay stack
	 * (FocusScope / EscapeLayer / DismissibleLayer / PresenceManager / portal + overlay <div>):
	 *   focus trap / restore / initial focus  → showModal() (drops FocusScope + the focus-memory stack)
	 *   focus CONTAINMENT (can't tab out)      → native, via inert on everything outside the dialog
	 *   focus trap LOOP (tab wraps ends)       → NOT native: inert stops escape but sequential nav lands
	 *                                            on <body> for one step instead of wrapping. The
	 *                                            controller's keydown handler closes that gap (via
	 *                                            `trapFocus`, wired here for every adapter).
	 *   Esc to close                           → native `cancel` (drops EscapeLayer + its global stack)
	 *   inert background (clicks/focus/AT)     → native modal, stronger than the JS Tab-trap
	 *   backdrop dim                           → ::backdrop (drops the rendered overlay <div>; the fade
	 *                                            lives in ui.css under `[data-modal-surface]`)
	 *   mount/unmount + enter/exit timing      → @starting-style + display/overlay allow-discrete
	 *                                            (drops the {#if shouldRender} presence gate)
	 *   click-outside to close                 → backdrop click; checked on `pointerdown` by default so
	 *                                            a text-selection drag that overshoots the edge isn't
	 *                                            misread as a backdrop click
	 * Surviving JS: the controller attachment (open↔showModal + dismissal sync + tab-wrap) and
	 * <ScrollLock> (native showModal makes the page inert but still scrollable; the ref-counted body
	 * lock stays, and `overflow:hidden` leaks touch-scroll on iOS Safari).
	 *
	 * Adapter gotcha (Tailwind): no `display` utility on the `<dialog>` itself — a grid/flex class
	 * overrides the UA `dialog:not([open]){display:none}`, leaving a closed dialog rendered and
	 * intercepting events (ui.css re-asserts the reset, but layout utilities belong on an inner
	 * wrapper). Each adapter's transition-property re-home stays in its own <style> — which
	 * properties animate (scale vs translate) is visual policy.
	 */
	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		// how the controller detects a backdrop dismissal; Dialog and Sheet both use the default.
		outsideEvent = 'pointerdown',
		// --- Accepted for API parity; the native <dialog> absorbs or no-ops these ---
		// no-op: the <dialog> is always rendered; showModal()/close() toggles visibility.
		forceMount = false,
		// no-op: native modal restores focus to the opener on close.
		onCloseAutoFocus = () => {},
		// no-op: showModal() autofocuses ([autofocus] or the first focusable).
		onOpenAutoFocus = () => {},
		// wired below via the native `cancel` event.
		onEscapeKeydown = () => {},
		// wired below via backdrop click.
		onInteractOutside = () => {},
		// no-op: a native modal makes the background inert (no focus-outside to report).
		onFocusOutside = () => {},
		// honored — enables the controller's sequential-focus wrap.
		trapFocus = true,
		// still honored — passed to the scrollLockAttachment below.
		preventScroll = true,
		restoreScrollDelay = null,
		// honored in the `cancel` / backdrop-click handlers below.
		escapeKeydownBehavior = 'close',
		interactOutsideBehavior = 'close',
		// no-op: not applicable to a native modal surface.
		preventOverflowTextSelection = true,
		// no-op: no portal — a modal <dialog> renders in place and is promoted to the top layer.
		portalProps,
		...restProps
	}: DialogContentProps & {
		outsideEvent?: 'pointerdown' | 'click';
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// Bridge the shared root `open` to the native top-layer API and mirror native dismissal back
	// into the root state, in one attachment. The root stays the source of truth, so Trigger /
	// Close / handleClose stay authoritative.
	//
	// NOTE: onOpenChangeComplete is intentionally NOT re-homed here. The Dialog root watches
	// `contentNode` (set by DialogContentState) and fires it once the <dialog>'s animations
	// settle (useOpenChangeComplete) — a listener here would double-fire it.
	const controllerAttachment = nativeDialogControllerAttachment({
		open: () => contentState.root.cell.open,
		onClose: () => contentState.root.handleClose(),
		// the controller takes this as a plain, non-reactive value — fixed per adapter at mount
		// svelte-ignore state_referenced_locally
		outsideEvent,
		onInteractOutside: () => onInteractOutside,
		interactOutsideBehavior: () => interactOutsideBehavior,
		onEscapeKeydown: () => onEscapeKeydown,
		escapeKeydownBehavior: () => escapeKeydownBehavior,
		trapFocus: () => trapFocus,
	});

	// The <dialog> persists across open/close, so the lock gates on the cell's open, not element lifecycle.
	const scrollLock = scrollLockAttachment({
		enabled: () => contentState.root.cell.open && preventScroll,
		restoreScrollDelay: () => restoreScrollDelay,
	});

	const mergedProps = $derived(mergeProps({ 'data-modal-surface': '' }, restProps, contentState.props, scrollLock));
</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, controllerAttachment), ...contentState.snippetProps })}
{:else}
	<!-- DialogContentState.props / DialogContentProps are authored for a <div>; their generic event
	     handlers are typed to HTMLDivElement, so assert the merged set as dialog attributes. -->
	<dialog {...controllerAttachment} {...mergedProps as unknown as HTMLDialogAttributes}>
		{@render children?.()}
	</dialog>
{/if}
