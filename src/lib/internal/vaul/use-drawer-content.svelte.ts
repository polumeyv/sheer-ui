import { type ComponentProps } from 'svelte';
import { attachRef, type ReadableBoxedValues, type WithRefProps } from '../tools/index.js';
import * as DrawerPrimitive from '../../components/dialog/index.js';
import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './constants.js';
import { assignStyle, isVertical } from './helpers.js';
import { getDrawer } from './use-drawer-root.svelte.js';
import type { DrawerDirection } from './types.js';

type DrawerPrimitiveContentProps = Pick<
	ComponentProps<typeof DrawerPrimitive.Content>,
	| 'onInteractOutside'
	| 'onOpenAutoFocus'
	| 'onFocusOutside'
	| 'onpointerdown'
	| 'onpointermove'
	| 'onpointerup'
	| 'onpointerout'
	| 'oncontextmenu'
>;
interface UseDrawerContentProps extends WithRefProps, ReadableBoxedValues<Required<DrawerPrimitiveContentProps>> {}

function useScaleBackground() {
	const ctx = getDrawer();
	let timeoutId: number | null = null;
	let initialBackgroundColor: string | undefined;

	const getScale = () => (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;

	$effect(() => {
		if (ctx.open.current && ctx.shouldScaleBackground.current) {
			initialBackgroundColor ??= document.body.style.backgroundColor;
			if (timeoutId) clearTimeout(timeoutId);
			const wrapper = document.querySelector<HTMLElement>('[data-vaul-drawer-wrapper]');

			if (!wrapper) return;

			// These styles are applied for good: upstream vaul chains their restore fns but discards
			// the chain, so the transition styles persist (the close animation needs them) and the
			// body background is restored by the timeout in the teardown below instead.
			if (ctx.setBackgroundColorOnScale.current && !ctx.noBodyStyles.current) assignStyle(document.body, { background: 'black' });
			assignStyle(wrapper, {
				transformOrigin: isVertical(ctx.direction.current) ? 'top' : 'left',
				transitionProperty: 'transform, border-radius',
				transitionDuration: `${TRANSITIONS.DURATION}s`,
				transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
			});

			const wrapperStylesCleanup = assignStyle(wrapper, {
				borderRadius: `${BORDER_RADIUS}px`,
				overflow: 'hidden',
				...(isVertical(ctx.direction.current)
					? {
							transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
						}
					: {
							transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
						}),
			});

			return () => {
				wrapperStylesCleanup();
				timeoutId = window.setTimeout(
					() =>
						initialBackgroundColor
							? (document.body.style.background = initialBackgroundColor)
							: document.body.style.removeProperty('background'),
					TRANSITIONS.DURATION * 1000,
				);
			};
		}
	});
}

export function useDrawerContent(opts: UseDrawerContentProps) {
	const ctx = getDrawer();

	// The attachment forwards through DialogPrimitive.Content to the real element,
	// pushing the node into context on mount and clearing it on unmount.
	const attachment = attachRef(opts.ref, (node) => ctx.setDrawerNode(node));

	let delayedSnapPoints = $state(false);
	let pointerStart: { x: number; y: number } | null = null;
	let lastKnownPointerEvent: PointerEvent | null = null;
	let wasBeyondThePoint = false;
	const hasSnapPoints = $derived(ctx.snapPoints.current && ctx.snapPoints.current.length > 0);

	useScaleBackground();

	function isDeltaInDirection(delta: { x: number; y: number }, direction: DrawerDirection, threshold = 0) {
		if (wasBeyondThePoint) return true;

		const deltaX = Math.abs(delta.x);
		const deltaY = Math.abs(delta.y);
		const isDeltaX = deltaX > deltaY;
		const dFactor = direction === 'bottom' || direction === 'right' ? 1 : -1;

		const isHorizontal = direction === 'left' || direction === 'right';
		const primaryDelta = isHorizontal ? deltaX : deltaY;
		const isReverseDirection = (isHorizontal ? delta.x : delta.y) * dFactor < 0;

		if (!isReverseDirection && primaryDelta >= 0 && primaryDelta <= threshold) {
			return isHorizontal ? isDeltaX : !isDeltaX;
		}

		wasBeyondThePoint = true;
		return true;
	}

	$effect(() => {
		if (hasSnapPoints && ctx.open.current) {
			window.requestAnimationFrame(() => {
				delayedSnapPoints = true;
			});
		} else {
			delayedSnapPoints = false;
		}
	});

	function handleOnPointerUp(e: PointerEvent | null) {
		pointerStart = null;
		wasBeyondThePoint = false;
		ctx.onRelease(e);
	}

	function onpointerdown(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (ctx.handleOnly.current) return;
		opts.onpointerdown.current?.(e);
		pointerStart = { x: e.pageX, y: e.pageY };
		ctx.onPress(e);
	}

	function onOpenAutoFocus(e: Event) {
		opts.onOpenAutoFocus.current?.(e);
		if (!ctx.autoFocus.current) {
			e.preventDefault();
		}
	}

	function onInteractOutside(e: PointerEvent) {
		opts.onInteractOutside.current?.(e);

		if (!ctx.modal.current || e.defaultPrevented) {
			e.preventDefault();
			return;
		}

		if (ctx.keyboardIsOpen.current) {
			ctx.keyboardIsOpen.current = false;
		}
	}

	function onFocusOutside(e: Event) {
		if (!ctx.modal.current) {
			e.preventDefault();
			return;
		}
	}

	function onpointermove(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		lastKnownPointerEvent = e;
		if (ctx.handleOnly.current) return;
		opts.onpointermove.current?.(e);
		if (!pointerStart) return;
		const yPosition = e.pageY - pointerStart.y;
		const xPosition = e.pageX - pointerStart.x;

		const swipeStartThreshold = e.pointerType === 'touch' ? 10 : 2;
		const delta = { x: xPosition, y: yPosition };

		const isAllowedToSwipe = isDeltaInDirection(delta, ctx.direction.current, swipeStartThreshold);
		if (isAllowedToSwipe) {
			ctx.onDrag(e);
		} else if (Math.abs(xPosition) > swipeStartThreshold || Math.abs(yPosition) > swipeStartThreshold) {
			pointerStart = null;
		}
	}

	function onpointerup(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		opts.onpointerup.current?.(e);
		handleOnPointerUp(e);
	}

	function onpointerout(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		opts.onpointerout.current?.(e);
		handleOnPointerUp(lastKnownPointerEvent);
	}

	function oncontextmenu(e: PointerEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		opts.oncontextmenu.current?.(e);
		handleOnPointerUp(lastKnownPointerEvent);
	}

	const props = $derived({
		id: opts.id.current,
		'data-vaul-drawer-direction': ctx.direction.current,
		'data-vaul-drawer': '',
		'data-vaul-delayed-snap-points': delayedSnapPoints ? 'true' : 'false',
		'data-vaul-snap-points': ctx.open.current && hasSnapPoints ? 'true' : 'false',
		'data-vaul-custom-container': ctx.container.current ? 'true' : 'false',
		'data-vaul-animate': ctx.shouldAnimate ? 'true' : 'false',
		onpointerdown,
		onOpenAutoFocus,
		onInteractOutside,
		onFocusOutside,
		onpointerup,
		onpointermove,
		onpointerout,
		oncontextmenu,
		preventScroll: ctx.modal.current,
		...attachment,
	});

	return {
		get props() {
			return props;
		},
		ctx,
	};
}
