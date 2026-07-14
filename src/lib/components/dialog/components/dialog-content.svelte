<script lang="ts">
	import { join } from 'overrule';
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
	 * Modal dialog rendered as a native `<dialog>` (showModal()/close()), mirroring sheet-content.svelte
	 * and the alert-modal's native-dialog.svelte. What native + CSS absorb, replacing the old JS overlay
	 * stack (FocusScope / EscapeLayer / DismissibleLayer / PresenceManager / portal + overlay <div>):
	 *   focus trap / restore / initial focus  → showModal() (drops FocusScope + the focus-memory stack)
	 *   focus CONTAINMENT (can't tab out)      → native, via inert on everything outside the dialog
	 *   focus trap LOOP (tab wraps ends)       → NOT native: inert stops escape but sequential nav lands
	 *                                            on <body> for one step instead of wrapping. The keydown
	 *                                            handler below closes just that gap (needs `tabbable`).
	 *   Esc to close                           → native `cancel` (drops EscapeLayer + its global stack)
	 *   inert background (clicks/focus/AT)     → native modal, stronger than the JS Tab-trap
	 *   backdrop dim                           → ::backdrop (drops the rendered Dialog.Overlay <div>)
	 *   mount/unmount + enter/exit timing      → @starting-style + display/overlay allow-discrete
	 *                                            (drops the {#if shouldRender} presence gate)
	 *   click-outside to close                 → backdrop click (drops DismissibleLayer + stack)
	 * Surviving JS: the `controller` attachment (open↔showModal + dismissal sync + tab-wrap) and
	 * <ScrollLock> (native showModal makes the page inert but still scrollable; the ref-counted body lock
	 * stays, and `overflow:hidden` leaks touch-scroll on iOS Safari).
	 *
	 * The visual surface (centered box, bg, border, radius, shadow, padding, sm:max-w-lg) is baked here —
	 * the shadcn convention, matching native-dialog.svelte — so a bare `<Dialog.Content>` is a styled
	 * modal; consumer `class` still merges to override (e.g. `max-w-md!`). Two Tailwind gotchas, same as
	 * native-dialog: no `display` utility on the <dialog> (a grid/flex class overrides the UA
	 * `dialog:not([open]){display:none}`, leaving a closed dialog rendered + intercepting events — grid
	 * lives on the inner wrapper); explicit centering via `fixed inset-0 m-auto h-fit` (preflight resets
	 * the UA `margin:auto` that would otherwise center it).
	 */
	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
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
		// no-op: showModal() traps focus.
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
		class: className,
		...restProps
	}: DialogContentProps & {
		portalProps?: WithoutChildrenOrChild<DialogPortalProps>;
	} = $props();

	const contentState = DialogContentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v),
		),
	});

	// Bridge the shared Dialog root `open` to the native top-layer API and mirror native dismissal back
	// into the root state, in one attachment (mirrors sheet-content.svelte / native-dialog.svelte). The
	// root (Dialog.Root) stays the source of truth, so Trigger / Close / handleClose stay authoritative.
	//
	// NOTE: onOpenChangeComplete is intentionally NOT re-homed here. The Dialog root keeps
	// `contentPresence`, and DialogContentState sets `contentNode`; that PresenceManager's
	// AnimationsComplete watches the <dialog>'s getAnimations() and already fires onOpenChangeComplete
	// after the transition settles — a transitionend listener here would double-fire it.
	const controllerAttachment = nativeDialogControllerAttachment({
		open: () => contentState.root.cell.open,
		onClose: () => contentState.root.handleClose(),
		outsideEvent: 'pointerdown',
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

	const mergedProps = $derived(
		mergeProps(
			{
				'data-slot': 'dialog-content',
				class: join(
					'dialog-content bg-background fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] overflow-y-auto rounded-lg border p-6 shadow-lg sm:max-w-lg',
					'scale-95 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-200',
					'open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0',
					className,
				),
			},
			restProps,
			contentState.props,
			scrollLock,
		),
	);

</script>

{#if child}
	{@render child({ props: mergeProps(mergedProps, controllerAttachment), ...contentState.snippetProps })}
{:else}
	<!-- DialogContentState.props / DialogContentProps are authored for a <div>; their generic event
	     handlers are typed to HTMLDivElement, so assert the merged set as dialog attributes. -->
	<dialog {...controllerAttachment} {...mergedProps as unknown as HTMLDialogAttributes}>
		<div class="grid gap-4">
			{@render children?.()}
		</div>
	</dialog>
{/if}

<style>
	/* The box + animation ride Tailwind utilities on the element; re-home transition-property here (this
	   UNLAYERED rule beats the layered Tailwind `transition`) so `display` + `overlay` join `scale`/
	   `opacity` with allow-discrete — that keeps the box in the top layer long enough for the CLOSE to
	   animate in Chromium. Firefox/Safari lack `overlay` and snap the close (they still animate the OPEN
	   via @starting-style) — the same progressive-enhancement trade as AlertModal / Sheet / Popover. */
	:global(.dialog-content) {
		transition-property: opacity, scale, display, overlay;
		transition-behavior: allow-discrete;
	}
	/* A closed <dialog> must stay hidden + non-interactive. The UA `dialog:not([open]){display:none}`
	   is overridden by no display utility here (grid lives on the inner wrapper), so the UA rule holds —
	   but re-assert unlayered to be robust against utility bleed. */
	:global(.dialog-content:not([open])) {
		display: none;
	}
	/* ::backdrop replaces the removed Dialog.Overlay (was `bg-black/50`). Fades in everywhere via
	   @starting-style; in Chromium it also fades out (overlay/display allow-discrete keep it alive). */
	:global(.dialog-content::backdrop) {
		background-color: rgb(0 0 0 / 0);
		transition:
			background-color 0.2s ease,
			overlay 0.2s allow-discrete,
			display 0.2s allow-discrete;
	}
	:global(.dialog-content[open]::backdrop) {
		background-color: rgb(0 0 0 / 0.5);
	}
	@starting-style {
		:global(.dialog-content[open]::backdrop) {
			background-color: rgb(0 0 0 / 0);
		}
	}
</style>
