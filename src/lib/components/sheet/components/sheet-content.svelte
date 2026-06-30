<script lang="ts" module>
	import { sheetVariants, type Side } from '$lib/components/sheet/variants.js';
	export { sheetVariants, type Side };
</script>

<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { boxWith } from '$lib/internal/tools/index.js';
	import { mergeProps } from '$lib/merge-props.js';
	import { DialogContentState } from '$lib/components/dialog/dialog.svelte.js';
	import type { DialogContentProps, DialogPortalProps } from '$lib/components/dialog/types.js';
	import { createId } from '$lib/internal/create-id.js';
	import { on } from 'svelte/events';
	import { createAttachmentKey } from 'svelte/attachments';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import ScrollLock from '$lib/components/utilities/scroll-lock/scroll-lock.svelte';
	import SheetClose from './sheet-close.svelte';
	import XIcon from '@lucide/svelte/icons/x';

	/**
	 * Side panel rendered as a native modal `<dialog>` (showModal()/close()), mirroring
	 * native-dialog.svelte. What native + CSS absorb, replacing the previous JS overlay stack:
	 *   focus trap / restore / initial focus  → showModal() (drops FocusScope + tabbable)
	 *   Esc to close                          → native `cancel` (drops EscapeLayer + its stack)
	 *   inert background (clicks/focus/AT)     → native modal, stronger than the JS Tab-trap
	 *   backdrop dim                           → ::backdrop (drops the rendered SheetOverlay <div>)
	 *   mount/unmount + enter/exit timing      → @starting-style + display/overlay allow-discrete
	 *                                            (drops the {#if shouldRender} presence gate)
	 *   click-outside to close                 → backdrop click (drops DismissibleLayer + stack)
	 * Surviving JS: the `controller` attachment (open↔showModal + dismissal sync) and <ScrollLock>
	 * (native showModal makes the page inert but still scrollable; the ref-counted body lock stays).
	 *
	 * The slide + per-side positioning still come from `sheetVariants({ side })`; `data-state`
	 * (from DialogContentState.props) drives its `data-[state=closed]:translate-…-full` exit.
	 */

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		side = 'right',
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
		// still honored — passed to <ScrollLock> below.
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

	// Bridge the shared Dialog root `open` to the native top-layer API and mirror native dismissal
	// back into the root state, in one attachment (mirrors native-dialog.svelte's `controller`). The
	// root (Sheet.Root) is the source of truth, so Trigger / Close / handleClose stay authoritative.
	//
	// NOTE: onOpenChangeComplete is intentionally NOT re-homed here. Unlike the Popover (whose root
	// dropped its PresenceManager), the Dialog root keeps `contentPresence`, and we keep
	// DialogContentState which sets `contentNode`. That PresenceManager's AnimationsComplete watches
	// the <dialog>'s getAnimations() and already fires onOpenChangeComplete after the slide settles —
	// adding a transitionend listener would double-fire it.
	function controller(node: HTMLDialogElement) {
		$effect(() => {
			const open = contentState.root.opts.open.current;
			if (open && !node.open) node.showModal();
			else if (!open && node.open) node.close();
		});

		// Any native dismissal (Esc default action, backdrop click, command=close) → sync the root.
		const offClose = on(node, 'close', () => contentState.root.handleClose());

		// Backdrop click: dismiss unless the onInteractOutside shim vetoes (preventDefault) or
		// interactOutsideBehavior is 'ignore'.
		const offClick = on(node, 'click', (event) => {
			if (event.target !== node) return;
			const shim = new PointerEvent('pointerdown', { cancelable: true });
			onInteractOutside(shim);
			if (shim.defaultPrevented || interactOutsideBehavior === 'ignore') return;
			node.close();
		});

		// Esc fires the native `cancel`, whose default action closes the dialog. Run the
		// onEscapeKeydown shim; if it vetoes (preventDefault) or escapeKeydownBehavior is 'ignore',
		// preventDefault the native close to keep the sheet open.
		const offCancel = on(node, 'cancel', (event) => {
			const shim = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
			onEscapeKeydown(shim);
			if (shim.defaultPrevented || escapeKeydownBehavior === 'ignore') event.preventDefault();
		});

		return () => {
			offClose();
			offClick();
			offCancel();
		};
	}

	const mergedProps = $derived(mergeProps({ 'data-slot': 'sheet-content', class: cn('sheet-dialog', sheetVariants({ side })) }, restProps, contentState.props));

	// For the (currently unused) `child` path the controller rides along as an attachment, so a
	// consumer MUST spread these props onto a native <dialog> for showModal()/close() to work.
	const controllerAttachment = { [createAttachmentKey()]: controller };
</script>

{#if contentState.root.opts.open.current}
	<ScrollLock {preventScroll} {restoreScrollDelay} />
{/if}
{#if child}
	{@render child({ props: mergeProps(mergedProps, controllerAttachment), ...contentState.snippetProps })}
{:else}
	<!-- DialogContentState.props / DialogContentProps are authored for a <div>; their generic event
	     handlers are typed to HTMLDivElement, so assert the merged set as dialog attributes. -->
	<dialog {@attach controller} {...(mergedProps as unknown as HTMLDialogAttributes)}>
		{@render children?.()}
		<SheetClose
			class="ring-offset-background focus-visible:ring-ring absolute inset-e-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none">
			<XIcon class="size-4" />
			<span class="sr-only">Close</span>
		</SheetClose>
	</dialog>
{/if}

<style>
	/* Neutralise the UA modal-dialog box defaults (`inset:0`, `margin:auto`, the `max-width/height`
	   caps) so the side variant's `inset-… h-full w-3/4 sm:max-w-sm` utilities own positioning + size.
	   Kept in @layer base on purpose: it beats the UA origin but still LOSES to the variant's Tailwind
	   utilities. An UNLAYERED reset would clobber the variant's inset/size — and because the variant
	   sets only 3 of the 4 insets, the UA's 4th (`left:0` for a right sheet) would otherwise leak
	   through and left-anchor the panel at full width. */
	@layer base {
		:global(.sheet-dialog) {
			inset: auto;
			margin: 0;
			max-width: none;
			max-height: none;
			padding: 0;
		}
	}

	/* The slide rides the variant's `transition` + duration utilities. Re-home transition-property
	   here (this UNLAYERED rule beats the layered Tailwind `transition`) so `display` + `overlay`
	   join `translate` with allow-discrete: that keeps the box in the top layer long enough for the
	   `data-[state=closed]:translate-…-full` EXIT to animate in Chromium. Firefox/Safari lack
	   `overlay` and snap the close (they still animate the OPEN via @starting-style) — the same
	   progressive-enhancement trade as AlertModal/Popover. */
	:global(.sheet-dialog) {
		transition-property: translate, transform, display, overlay;
		transition-behavior: allow-discrete;
	}
	/* The variant puts `flex flex-col` on the dialog for internal layout. A display utility overrides
	   the UA `dialog:not([open]) { display: none }`, so re-assert it here (unlayered → wins) to keep a
	   closed dialog hidden + non-interactive while still flexing when open. */
	:global(.sheet-dialog:not([open])) {
		display: none;
	}
	/* ::backdrop replaces the removed SheetOverlay (was `bg-black/50`). Fades in everywhere via
	   @starting-style; in Chromium it also fades out (overlay/display allow-discrete keep it alive). */
	:global(.sheet-dialog::backdrop) {
		background-color: rgb(0 0 0 / 0);
		transition:
			background-color 0.3s ease,
			overlay 0.3s allow-discrete,
			display 0.3s allow-discrete;
	}
	:global(.sheet-dialog[open]::backdrop) {
		background-color: rgb(0 0 0 / 0.5);
	}
	@starting-style {
		:global(.sheet-dialog[open]::backdrop) {
			background-color: rgb(0 0 0 / 0);
		}
	}
</style>
