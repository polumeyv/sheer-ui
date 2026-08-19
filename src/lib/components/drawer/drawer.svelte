<script lang="ts">
	import { untrack } from 'svelte';
	import { DialogRootState, DialogState } from '../dialog/dialog.svelte.js';
	import { OpenCell } from '../../internal/open-cell.svelte.js';
	import { boxWith } from '../../internal/tools/index.js';
	import type { DrawerRootProps as RootProps } from '../../internal/vaul/types.js';
	import { CLOSE_THRESHOLD, SCROLL_LOCK_TIMEOUT } from '../../internal/vaul/constants.js';
	import { useDrawerRoot } from '../../internal/vaul/use-drawer-root.svelte.js';

	let {
		open = false,
		state: givenCell,
		_internal_onOpenChange = () => {},
		onDrag = () => {},
		onRelease = () => {},
		snapPoints,
		shouldScaleBackground = true,
		setBackgroundColorOnScale = true,
		closeThreshold = CLOSE_THRESHOLD,
		scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
		dismissible = true,
		handleOnly = false,
		fadeFromIndex = snapPoints && snapPoints.length - 1,
		activeSnapPoint = $bindable(snapPoints?.[0] ?? null),
		onActiveSnapPointChange = () => {},
		fixed = false,
		modal = true,
		onClose = () => {},
		nested = false,
		noBodyStyles = false,
		direction = 'bottom',
		snapToSequentialPoint = false,
		preventScrollRestoration = false,
		repositionInputs = true,
		onAnimationEnd = () => {},
		onOpenChangeComplete = () => {},
		container = null,
		autoFocus = false,
		disablePreventScroll = true,
		...restProps
	}: Omit<RootProps, 'open' | 'onOpenChange'> & {
		/**
		 * The derivation source for the drawer's open state: the internal cell
		 * re-derives whenever this prop changes, and interactions (drag-dismiss,
		 * a snippet-cell write) override it until the next change. Not bindable.
		 */
		open?: boolean;
		/**
		 * A caller-constructed cell (own source and, optionally, a delegate writer)
		 * used instead of building one from `open`. When given, `open` is ignored.
		 */
		state?: OpenCell;
		/** Machine-level open notification for the nested-drawer wiring — not a consumer API. */
		_internal_onOpenChange?: (open: boolean) => void;
	} = $props();

	function handleOpenChangeComplete(o: boolean) {
		rootState.handleOpenChangeComplete(o);
		onOpenChangeComplete(o);
	}

	// Consumer cell over the source prop; vaul's machine keeps its boxed-open input
	// (vendored, ADR 0006) — the box is a bridge over the cell, so the cell owns the
	// consumer-facing `open` while the machine still drives dismissal internally.
	// svelte-ignore state_referenced_locally
	const cell = givenCell ?? new OpenCell(() => open);

	const rootState = useDrawerRoot({
		open: boxWith(
			() => cell.open,
			(o) => (cell.open = o),
		),
		closeThreshold: boxWith(() => closeThreshold),
		scrollLockTimeout: boxWith(() => scrollLockTimeout),
		snapPoints: boxWith(() => snapPoints),
		fadeFromIndex: boxWith(() => fadeFromIndex),
		nested: boxWith(() => nested),
		shouldScaleBackground: boxWith(() => shouldScaleBackground),
		activeSnapPoint: boxWith(
			() => activeSnapPoint,
			(v) => {
				activeSnapPoint = v;
				onActiveSnapPointChange(v);
			},
		),
		onRelease: boxWith(() => onRelease),
		onDrag: boxWith(() => onDrag),
		onClose: boxWith(() => onClose),
		dismissible: boxWith(() => dismissible),
		direction: boxWith(() => direction),
		fixed: boxWith(() => fixed),
		modal: boxWith(() => modal),
		handleOnly: boxWith(() => handleOnly),
		noBodyStyles: boxWith(() => noBodyStyles),
		preventScrollRestoration: boxWith(() => preventScrollRestoration),
		setBackgroundColorOnScale: boxWith(() => setBackgroundColorOnScale),
		repositionInputs: boxWith(() => repositionInputs),
		autoFocus: boxWith(() => autoFocus),
		snapToSequentialPoint: boxWith(() => snapToSequentialPoint),
		container: boxWith(() => container),
		disablePreventScroll: boxWith(() => disablePreventScroll),
		onOpenChange: boxWith(() => _internal_onOpenChange),
		onAnimationEnd: boxWith(() => onAnimationEnd),
	});

	// The drawer (vendored vaul) is an external state machine that owns `open`;
	// the dialog cell derives from it. Dialog-initiated closes (a Close button,
	// the dialog layers) write the cell, and this adapter routes them through
	// the drawer's own animated close instead of just flipping the signal.
	// The drawer acts as its own dialog root (the sheet.svelte pattern) so the
	// cell stays internal — no consumer-facing state surface exists.
	const dialogCell = new DialogState(() => rootState.open.current);
	$effect(() => {
		const o = dialogCell.open;
		untrack(() => {
			if (o !== rootState.open.current) rootState.onDialogOpenChange(o);
		});
	});

	DialogRootState.create({
		variant: boxWith(() => 'dialog'),
		cell: dialogCell,
		onOpenChangeComplete: boxWith(() => handleOpenChangeComplete),
	});
</script>

{@render restProps.children?.()}

<style global>
	/* Mirrors TRANSITIONS in internal/vaul/constants.ts — keep the two in sync. */
	:global([data-vaul-drawer]),
	:global([data-vaul-overlay]) {
		--vaul-duration: 0.5s;
		--vaul-ease: cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global([data-vaul-drawer]) {
		touch-action: none;
		will-change: transform;
		transition: transform var(--vaul-duration) var(--vaul-ease);
		animation-duration: var(--vaul-duration);
		animation-timing-function: var(--vaul-ease);
	}

	:global([data-vaul-overlay]) {
		transition: opacity var(--vaul-duration) var(--vaul-ease);
	}

	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='bottom'][data-state='open']) {
		animation-name: slideFromBottom;
	}
	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='bottom'][data-state='closed']) {
		animation-name: slideToBottom;
	}

	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='top'][data-state='open']) {
		animation-name: slideFromTop;
	}
	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='top'][data-state='closed']) {
		animation-name: slideToTop;
	}

	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='left'][data-state='open']) {
		animation-name: slideFromLeft;
	}
	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='left'][data-state='closed']) {
		animation-name: slideToLeft;
	}

	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='right'][data-state='open']) {
		animation-name: slideFromRight;
	}
	:global([data-vaul-drawer][data-vaul-snap-points='false'][data-vaul-drawer-direction='right'][data-state='closed']) {
		animation-name: slideToRight;
	}

	:global([data-vaul-drawer][data-vaul-snap-points='true'][data-vaul-drawer-direction='bottom']) {
		transform: translate3d(0, var(--initial-transform, 100%), 0);
	}

	:global([data-vaul-drawer][data-vaul-snap-points='true'][data-vaul-drawer-direction='top']) {
		transform: translate3d(0, calc(var(--initial-transform, 100%) * -1), 0);
	}

	:global([data-vaul-drawer][data-vaul-snap-points='true'][data-vaul-drawer-direction='left']) {
		transform: translate3d(calc(var(--initial-transform, 100%) * -1), 0, 0);
	}

	:global([data-vaul-drawer][data-vaul-snap-points='true'][data-vaul-drawer-direction='right']) {
		transform: translate3d(var(--initial-transform, 100%), 0, 0);
	}

	:global([data-vaul-drawer][data-vaul-delayed-snap-points='true'][data-vaul-drawer-direction='top']) {
		transform: translate3d(0, var(--snap-point-height, 0), 0);
	}

	:global([data-vaul-drawer][data-vaul-delayed-snap-points='true'][data-vaul-drawer-direction='bottom']) {
		transform: translate3d(0, var(--snap-point-height, 0), 0);
	}

	:global([data-vaul-drawer][data-vaul-delayed-snap-points='true'][data-vaul-drawer-direction='left']) {
		transform: translate3d(var(--snap-point-height, 0), 0, 0);
	}

	:global([data-vaul-drawer][data-vaul-delayed-snap-points='true'][data-vaul-drawer-direction='right']) {
		transform: translate3d(var(--snap-point-height, 0), 0, 0);
	}

	:global([data-vaul-overlay][data-vaul-snap-points='false']) {
		animation-duration: var(--vaul-duration);
		animation-timing-function: var(--vaul-ease);
	}
	:global([data-vaul-overlay][data-vaul-snap-points='false'][data-state='open']) {
		animation-name: fadeIn;
	}
	:global([data-vaul-overlay][data-state='closed']) {
		animation-name: fadeOut;
	}

	:global([data-vaul-animate='false']) {
		animation: none !important;
	}

	:global([data-vaul-overlay][data-vaul-snap-points='true']) {
		opacity: 1;
	}

	:global([data-vaul-drawer].vaul-dragging),
	:global([data-vaul-overlay].vaul-dragging) {
		transition: none;
	}

	:global([data-vaul-drawer]:not([data-vaul-custom-container='true'])::after) {
		content: '';
		position: absolute;
		background: inherit;
		background-color: inherit;
	}

	:global([data-vaul-drawer][data-vaul-drawer-direction='top']::after) {
		top: initial;
		bottom: 100%;
		left: 0;
		right: 0;
		height: 200%;
	}

	:global([data-vaul-drawer][data-vaul-drawer-direction='bottom']::after) {
		top: 100%;
		bottom: initial;
		left: 0;
		right: 0;
		height: 200%;
	}

	:global([data-vaul-drawer][data-vaul-drawer-direction='left']::after) {
		left: initial;
		right: 100%;
		top: 0;
		bottom: 0;
		width: 200%;
	}

	:global([data-vaul-drawer][data-vaul-drawer-direction='right']::after) {
		left: 100%;
		right: initial;
		top: 0;
		bottom: 0;
		width: 200%;
	}

	:global([data-vaul-overlay][data-vaul-snap-points='true']:not([data-vaul-snap-points-overlay='true']):not([data-state='closed'])) {
		opacity: 0;
	}

	:global([data-vaul-overlay][data-vaul-snap-points-overlay='true']) {
		opacity: 1;
	}

	:global([data-vaul-handle]) {
		display: block;
		position: relative;
		opacity: 0.7;
		background: #e2e2e4;
		margin-left: auto;
		margin-right: auto;
		height: 5px;
		width: 32px;
		border-radius: 1rem;
		touch-action: pan-y;
	}

	:global([data-vaul-handle]:hover, [data-vaul-handle]:active) {
		opacity: 1;
	}

	:global([data-vaul-handle-hitarea]) {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: max(100%, 2.75rem); /* 44px */
		height: max(100%, 2.75rem); /* 44px */
		touch-action: inherit;
	}

	@media (hover: hover) and (pointer: fine) {
		:global([data-vaul-drawer]) {
			user-select: none !important;
		}
	}

	@media (pointer: fine) {
		:global([data-vaul-handle-hitarea]) {
			width: 100%;
			height: 100%;
		}
	}
</style>
