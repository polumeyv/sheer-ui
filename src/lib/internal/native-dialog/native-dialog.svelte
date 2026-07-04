<script lang="ts">
	import { join } from 'overrule';
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { on } from 'svelte/events';
	import ScrollLock from '../scroll-lock/scroll-lock.svelte';
	import { getTabbableCandidates } from '../tabbable.js';

	/**
	 * SPIKE: a modal dialog on the native <dialog> element + showModal(), to diff against the vendored
	 * bits Dialog (components/dialog/*). What native + CSS absorb, and the one thing they don't:
	 *   focus restore + initial focus        → showModal() (deletes the FocusScope focus-memory stack)
	 *   focus CONTAINMENT (can't tab out)    → native, via inert on everything outside the dialog
	 *   focus trap LOOP (tab off the last    → NOT fully native. inert only stops focus from escaping;
	 *   element wraps to the first, etc.)      it doesn't make sequential nav wrap. Tabbing off the last
	 *                                          tabbable (or shift-tabbing off the first) lands on <body>
	 *                                          for one step instead of wrapping, confirmed in Chromium.
	 *                                          The keydown handler below is the one piece of FocusScope's
	 *                                          trap (and the `tabbable` dep) still needed here -- kept
	 *                                          minimal, no pause/stack/focus-memory, since the native top
	 *                                          layer already handles dialog-over-dialog nesting.
	 *   Esc to close (+ nested ordering)     → native (deletes EscapeLayer + its global stack)
	 *   inert background (clicks/focus/AT)   → native, stronger than the JS Tab-trap
	 *   backdrop                             → ::backdrop (deletes the JS-rendered overlay <div>)
	 *   mount/unmount + enter/exit timing    → @starting-style + transition: display/overlay allow-discrete
	 *                                          (deletes PresenceManager + AnimationsComplete)
	 *   click-outside to close               → backdrop pointerdown / closedby="any" (deletes
	 *                                          DismissibleLayer + stack; checked on pointerdown rather
	 *                                          than click so a text-selection drag that overshoots past
	 *                                          the dialog edge isn't misread as a backdrop click)
	 *   BACKGROUND SCROLL LOCK               → NOT native. showModal makes the page inert but does NOT
	 *                                          stop scrolling, and `overflow: hidden` leaks touch-scroll
	 *                                          on iOS Safari — so `lockScroll` below is the one piece of
	 *                                          BodyScrollLock that genuinely stays in JS.
	 * Surviving JS: the `controller` attachment (open↔showModal + dismissal sync + tab-wrap) and <ScrollLock>.
	 *
	 * Two Tailwind gotchas this layout works around:
	 *   1. NO `display` utility on the <dialog> itself — a `grid`/`flex` class overrides the UA
	 *      `dialog:not([open]) { display: none }`, leaving the closed dialog rendered (opacity-0) and
	 *      intercepting pointer events. Grid lives on the inner wrapper; the dialog's display stays
	 *      UA-controlled (none ↔ block), which the display transition needs.
	 *   2. Explicit centering (`fixed inset-0 m-auto h-fit`) — Tailwind's preflight resets the dialog
	 *      margin, killing the UA `margin: auto` that would otherwise center a modal.
	 *
	 * Close animation: `overlay` (transitioned with allow-discrete) keeps the box + ::backdrop in the
	 * top layer while they fade/scale out, so the CLOSE animates — in Chromium. Safari/Firefox don't
	 * implement `overlay`, so they animate the OPEN (via @starting-style, Baseline) and snap the CLOSE.
	 * Pure progressive enhancement: harmless where unsupported, and it "just works" once they ship it.
	 * `overlay` + `transition-discrete` are the cross:classes-gate-flagged utilities (the Tooltip carries
	 * the same ack in class-divergences.json).
	 */
	let {
		open = $bindable(false),
		onOpenChange,
		children,
		id,
		class: className,
		...restProps
	}: Omit<HTMLDialogAttributes, 'open' | 'children'> & {
		/** Controlled, two-way bindable open state (drive it from a store like alertModal). */
		open?: boolean;
		/** Fires on native dismissal (Esc / outside / a command=close button) so a store can sync. */
		onOpenChange?: (open: boolean) => void;
		/** Modal surface contents — the consumer supplies title/description/actions (shadcn convention). */
		children: Snippet;
	} = $props();

	const uid = $props.id();
	const dialogId = $derived(id ?? `native-dialog-${uid}`);

	// Bridge `open` to the imperative top-layer API + mirror native dismissal back, in one attachment.
	// Guards keep showModal()/close() idempotent; `open` is read only in the nested effect and the
	// listeners, so the attachment sets up once.
	function controller(node: HTMLDialogElement) {
		$effect(() => {
			if (open && !node.open) node.showModal();
			else if (!open && node.open) node.close();
		});
		const offClose = on(node, 'close', () => {
			if (!open) return;
			open = false;
			onOpenChange?.(false);
		});
		// Backdrop click closes -- checked on pointerdown (gesture start), not click (gesture end).
		// A click's target is reconciled to the nearest common ancestor of the mousedown and mouseup
		// targets when they differ (spec'd, cross-browser), so a text-selection drag that starts
		// inside content and overshoots past the dialog edge before release would otherwise land on
		// `node` and get misread as a backdrop click. Checking pointerdown avoids that ambiguity
		// entirely -- same rule the JS dismissible-layer uses for the vendored Dialog.
		const offPointerDown = on(node, 'pointerdown', (event) => {
			if (event.target === node) node.close();
		});
		// inert stops focus from escaping to the background, but sequential nav doesn't wrap on its
		// own -- tabbing off the last tabbable (or shift-tabbing off the first) lands on <body> for
		// one step instead of looping back. This closes just that gap.
		const offKeydown = on(node, 'keydown', (event) => {
			if (event.key !== 'Tab') return;
			const tabbables = getTabbableCandidates(node);
			if (tabbables.length === 0) return;
			const first = tabbables[0]!;
			const last = tabbables[tabbables.length - 1]!;
			const activeElement = node.ownerDocument.activeElement;
			if (!event.shiftKey && activeElement === last) {
				event.preventDefault();
				first.focus();
			} else if (event.shiftKey && activeElement === first) {
				event.preventDefault();
				last.focus();
			}
		});
		return () => {
			offClose();
			offPointerDown();
			offKeydown();
		};
	}

</script>

{#if open}
	<ScrollLock />
{/if}

<dialog
	{@attach controller}
	{...restProps}
	id={dialogId}
	data-slot="native-dialog"
	class={join(
		'native-dialog bg-background pointer-events-auto fixed inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] overflow-y-auto rounded-lg border p-6 shadow-lg sm:max-w-lg',
		'scale-95 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-200',
		'open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0',
		className,
	)}>
	<div class="grid gap-4">
		{@render children()}
	</div>
</dialog>

<style>
	/* ::backdrop replaces the JS-rendered overlay <div>. It fades IN everywhere (@starting-style). In
	   Chromium it also fades OUT — the `overlay` transition keeps it in the top layer during close;
	   Safari/Firefox don't implement `overlay`, so they remove it instantly (snap). Progressive
	   enhancement: harmless where unsupported. */
	:global(.native-dialog::backdrop) {
		background-color: rgb(0 0 0 / 0);
		transition:
			background-color 0.2s ease,
			overlay 0.2s allow-discrete,
			display 0.2s allow-discrete;
	}
	:global(.native-dialog[open]::backdrop) {
		background-color: rgb(0 0 0 / 0.5);
	}
	@starting-style {
		:global(.native-dialog[open]::backdrop) {
			background-color: rgb(0 0 0 / 0);
		}
	}
</style>
