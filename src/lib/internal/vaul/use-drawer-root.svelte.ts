import { simpleBox, type ReadableBoxedValues, type WritableBoxedValues } from '../tools/index.js';
import type { DrawerDirection } from './types.js';
import { useSnapPoints } from './use-snap-points.svelte.js';
import { isInput, usePreventScroll } from './use-prevent-scroll.svelte.js';
import { usePositionFixed } from './use-position-fixed.svelte.js';
import {
	BORDER_RADIUS,
	DRAG_CLASS,
	NESTED_DISPLACEMENT,
	TRANSITIONS,
	VELOCITY_THRESHOLD,
	WINDOW_TOP_OFFSET,
} from './constants.js';
import { isIOSFirefox } from './browser.js';
import { isIOS } from '../tools/utils/dom.js';
import { on } from 'svelte/events';
import { createContext, tick, untrack } from 'svelte';
import { assignStyle, applyStyle, dampenValue, getTranslate, isVertical } from './helpers.js';

export type DrawerContext = ReturnType<typeof useDrawerRoot>;
const [getDrawer, setDrawer] = createContext<DrawerContext>();
export { getDrawer };

type UseDrawerRootProps = ReadableBoxedValues<{
	closeThreshold: number;
	shouldScaleBackground: boolean;
	scrollLockTimeout: number;
	snapPoints: (string | number)[] | undefined;
	fadeFromIndex: number | undefined;
	fixed: boolean;
	dismissible: boolean;
	direction: DrawerDirection;
	onDrag: (event: PointerEvent, percentageDragged: number) => void;
	onRelease: (event: PointerEvent, open: boolean) => void;
	nested: boolean;
	onClose: () => void;
	modal: boolean;
	handleOnly: boolean;
	noBodyStyles: boolean;
	preventScrollRestoration: boolean;
	setBackgroundColorOnScale: boolean;
	container: HTMLElement | null;
	snapToSequentialPoint: boolean;
	repositionInputs: boolean;
	autoFocus: boolean;
	disablePreventScroll: boolean;
	onOpenChange: (o: boolean) => void;
	onAnimationEnd: (open: boolean) => void;
}> &
	WritableBoxedValues<{
		open: boolean;
		activeSnapPoint: number | string | null;
	}>;

export function useDrawerRoot(opts: UseDrawerRootProps) {
	let hasBeenOpened = $state(false);
	let isDragging = $state(false);
	let justReleased = $state(false);
	let overlayNode = $state<HTMLElement | null>(null);
	let drawerNode = $state<HTMLElement | null>(null);
	let openTime: number | null = null;
	let dragStartTime: number | null = null;
	let lastTimeDragPrevented: number | null = null;
	let isAllowedToDrag = false;
	let nestedTransitionCleanup: (() => void) | null = null;
	let pointerStart = 0;
	let keyboardIsOpen = simpleBox(false);
	let shouldAnimate = $state(!opts.open.current);
	let previousDiffFromInitial = 0;
	let drawerHeight = 0;
	let drawerWidth = 0;
	let initialDrawerHeight = 0;
	let isReleasing = false;

	const snapPointsState = useSnapPoints({
		snapPoints: opts.snapPoints,
		drawerNode: () => drawerNode,
		activeSnapPoint: opts.activeSnapPoint,
		container: opts.container,
		direction: opts.direction,
		fadeFromIndex: opts.fadeFromIndex,
		overlayNode: () => overlayNode,
		setOpenTime: (time) => {
			openTime = time;
		},
		snapToSequentialPoint: opts.snapToSequentialPoint,
		open: opts.open,
		isReleasing: () => isReleasing,
	});

	usePreventScroll({
		isDisabled: () =>
			!opts.open.current ||
			isDragging ||
			!opts.modal.current ||
			justReleased ||
			!hasBeenOpened ||
			!opts.repositionInputs.current ||
			!opts.disablePreventScroll.current,
	});

	const { restorePositionSetting } = usePositionFixed({
		...opts,
		hasBeenOpened: () => hasBeenOpened,
	});

	function getScale() {
		return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
	}

	function onPress(event: PointerEvent) {
		if (!opts.dismissible.current && !opts.snapPoints.current) return;
		if (drawerNode && !drawerNode.contains(event.target as Node)) return;

		drawerHeight = drawerNode?.getBoundingClientRect().height || 0;
		drawerWidth = drawerNode?.getBoundingClientRect().width || 0;
		isDragging = true;
		dragStartTime = event.timeStamp;

		// iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
		if (isIOS) {
			on(window, 'touchend', () => (isAllowedToDrag = false), { once: true });
		}
		// Ensure we maintain correct pointer capture even when going outside of the drawer
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		pointerStart = isVertical(opts.direction.current) ? event.pageY : event.pageX;
	}

	function shouldDrag(el: EventTarget, isDraggingInDirection: boolean) {
		let element = el as HTMLElement;
		const highlightedText = window.getSelection()?.toString();
		const swipeAmount = drawerNode ? getTranslate(drawerNode, opts.direction.current) : null;
		// performance.now() shares PointerEvent.timeStamp's monotonic time origin, so the two mix safely.
		const now = performance.now();

		// Fixes https://github.com/emilkowalski/vaul/issues/483
		if (element.tagName === 'SELECT') return false;

		if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]')) {
			return false;
		}

		if (opts.direction.current === 'right' || opts.direction.current === 'left') {
			return true;
		}

		// Allow scrolling when animating
		if (openTime && now - openTime < TRANSITIONS.DURATION * 1000) {
			return false;
		}

		if (swipeAmount !== null) {
			if (opts.direction.current === 'bottom' ? swipeAmount > 0 : swipeAmount < 0) {
				return true;
			}
		}

		// Don't drag if there's highlighted text
		if (highlightedText && highlightedText.length > 0) {
			return false;
		}

		// Disallow dragging if drawer was scrolled within `scrollLockTimeout`
		if (lastTimeDragPrevented && now - lastTimeDragPrevented < opts.scrollLockTimeout.current && swipeAmount === 0) {
			lastTimeDragPrevented = now;
			return false;
		}

		if (isDraggingInDirection) {
			lastTimeDragPrevented = now;

			// We are dragging down so we should allow scrolling
			return false;
		}

		// Keep climbing up the DOM tree as long as there's a parent
		while (element) {
			// Check if the element is scrollable
			if (element.scrollHeight > element.clientHeight) {
				if (element.scrollTop !== 0) {
					lastTimeDragPrevented = performance.now();

					// The element is scrollable and not scrolled to the top, so don't drag
					return false;
				}

				if (element.getAttribute('role') === 'dialog') {
					return true;
				}
			}

			// Move up to the parent element
			element = element.parentNode as HTMLElement;
		}

		// No scrollable parents not scrolled to the top found, so drag
		return true;
	}

	function onDrag(event: PointerEvent) {
		if (!drawerNode || !isDragging) return;

		// We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
		const directionMultiplier = opts.direction.current === 'bottom' || opts.direction.current === 'right' ? 1 : -1;
		const draggedDistance = (pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX)) * directionMultiplier;
		const isDraggingInDirection = draggedDistance > 0;

		// Pre condition for disallowing dragging in the close direction.
		const noCloseSnapPointsPreCondition = opts.snapPoints.current && !opts.dismissible.current && !isDraggingInDirection;

		// Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
		if (noCloseSnapPointsPreCondition && snapPointsState.activeSnapPointIndex === 0) return;

		// We need to capture last time when drag with scroll was triggered and have a timeout between
		const absDraggedDistance = Math.abs(draggedDistance);
		const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
		const drawerDimension = opts.direction.current === 'bottom' || opts.direction.current === 'top' ? drawerHeight : drawerWidth;

		// Calculate the percentage dragged, where 1 is the closed position
		let percentageDragged = absDraggedDistance / drawerDimension;
		const snapPointPercentageDragged = snapPointsState.getPercentageDragged(absDraggedDistance, isDraggingInDirection);

		if (snapPointPercentageDragged !== null) {
			percentageDragged = snapPointPercentageDragged;
		}

		// Disallow close dragging beyond the smallest snap point.
		if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
			return;
		}

		if (!isAllowedToDrag && !shouldDrag(event.target!, isDraggingInDirection)) return;
		// The class suppresses the stylesheet transitions on both nodes while dragging.
		drawerNode.classList.add(DRAG_CLASS);
		overlayNode?.classList.add(DRAG_CLASS);
		// If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
		isAllowedToDrag = true;

		if (opts.snapPoints.current) {
			snapPointsState.onDrag({ draggedDistance });
		}

		// Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
		if (isDraggingInDirection && !opts.snapPoints.current) {
			const dampenedDraggedDistance = dampenValue(draggedDistance);

			const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
			assignStyle(drawerNode, {
				transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`,
			});
			return;
		}

		const opacityValue = 1 - percentageDragged;

		if (
			snapPointsState.shouldFade ||
			(opts.fadeFromIndex.current && snapPointsState.activeSnapPointIndex === opts.fadeFromIndex.current - 1)
		) {
			opts.onDrag.current?.(event, percentageDragged);

			applyStyle(overlayNode, {
				opacity: `${opacityValue}`,
			});
		}

		if (wrapper && overlayNode && opts.shouldScaleBackground.current) {
			// Calculate percentageDragged as a fraction (0 to 1)
			const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
			const borderRadiusValue = 8 - percentageDragged * 8;

			const translateValue = Math.max(0, 14 - percentageDragged * 14);

			applyStyle(wrapper, {
				borderRadius: `${borderRadiusValue}px`,
				transform: isVertical(opts.direction.current)
					? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)`
					: `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
				transition: 'none',
			});
		}

		if (!opts.snapPoints.current) {
			const translateValue = absDraggedDistance * directionMultiplier;
			applyStyle(drawerNode, {
				transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`,
			});
		}
	}

	$effect(() => {
		window.requestAnimationFrame(() => {
			shouldAnimate = true;
		});
	});

	function onDialogOpenChange(o: boolean) {
		if (!opts.dismissible.current && !o) return;
		if (o) {
			hasBeenOpened = true;
		} else {
			closeDrawer(true);
		}

		opts.open.current = o;
		handleOpenChange(o);
	}

	function onVisualViewportChange() {
		if (!drawerNode || !opts.repositionInputs.current) return;

		const focusedElement = document.activeElement as HTMLElement;
		if (isInput(focusedElement) || keyboardIsOpen.current) {
			const visualViewportHeight = window.visualViewport?.height || 0;
			const totalHeight = window.innerHeight;
			// This is the height of the keyboard
			let diffFromInitial = totalHeight - visualViewportHeight;
			const drawerHeight = drawerNode.getBoundingClientRect().height || 0;
			// Adjust drawer height only if it's tall enough
			const isTallEnough = drawerHeight > totalHeight * 0.8;

			if (!initialDrawerHeight) {
				initialDrawerHeight = drawerHeight;
			}
			const offsetFromTop = drawerNode.getBoundingClientRect().top;

			// visualViewport height may change due to some subtle changes to the keyboard. Checking if the height changed by 60 or more will make sure that they keyboard really changed its open state.
			if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
				keyboardIsOpen.current = !keyboardIsOpen.current;
			}

			if (
				opts.snapPoints.current &&
				opts.snapPoints.current.length > 0 &&
				snapPointsState.snapPointsOffset &&
				snapPointsState.activeSnapPointIndex
			) {
				const activeSnapPointHeight = snapPointsState.snapPointsOffset[snapPointsState.activeSnapPointIndex] || 0;
				diffFromInitial += activeSnapPointHeight;
			}
			previousDiffFromInitial = diffFromInitial;
			// We don't have to change the height if the input is in view, when we are here we are in the opened keyboard state so we can correctly check if the input is in view
			if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
				const height = drawerNode.getBoundingClientRect().height;
				let newDrawerHeight = height;

				if (height > visualViewportHeight) {
					newDrawerHeight = visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
				}
				// When fixed, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
				if (opts.fixed.current) {
					drawerNode.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
				} else {
					drawerNode.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
				}
			} else if (!isIOSFirefox()) {
				drawerNode.style.height = `${initialDrawerHeight}px`;
			}

			if (opts.snapPoints.current && opts.snapPoints.current.length > 0 && !keyboardIsOpen.current) {
				drawerNode.style.bottom = `0px`;
			} else {
				// Negative bottom value would never make sense
				drawerNode.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
			}
		}
	}

	$effect(() => {
		if (!window.visualViewport) return;
		return on(window.visualViewport, 'resize', onVisualViewportChange);
	});

	function cancelDrag() {
		if (!isDragging || !drawerNode) return;

		drawerNode.classList.remove(DRAG_CLASS);
		overlayNode?.classList.remove(DRAG_CLASS);
		isAllowedToDrag = false;
		isDragging = false;
	}

	function closeDrawer(fromWithin?: boolean) {
		cancelDrag();
		opts.onClose?.current();

		if (!fromWithin) {
			opts.open.current = false;
			handleOpenChange(false);
		}
	}

	function resetDrawer() {
		if (!drawerNode) return;

		const wrapper = document.querySelector('[data-vaul-drawer-wrapper]');
		const currentSwipeAmount = getTranslate(drawerNode, opts.direction.current);

		applyStyle(drawerNode, {
			transform: 'translate3d(0, 0, 0)',
		});
		// Clear inline values so the stylesheet transitions and rest-state opacity take
		// back over (a nested-close freeze can leave an inline `transition: none` behind).
		drawerNode.style.removeProperty('transition');
		overlayNode?.style.removeProperty('opacity');
		overlayNode?.style.removeProperty('transition');

		if (opts.shouldScaleBackground.current && currentSwipeAmount && currentSwipeAmount > 0 && opts.open.current) {
			applyStyle(wrapper, {
				borderRadius: `${BORDER_RADIUS}px`,
				overflow: 'hidden',
				...(isVertical(opts.direction.current)
					? {
							transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
							transformOrigin: 'top',
						}
					: {
							transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
							transformOrigin: 'left',
						}),
				transitionProperty: 'transform, border-radius',
				transitionDuration: `${TRANSITIONS.DURATION}s`,
				transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
			});
		}
	}

	function onRelease(event: PointerEvent | null) {
		// We keep track of whether we are releasing or not
		// because we need to differentiate release from outside click/escape keydown
		isReleasing = true;
		handleRelease(event);
		tick().then(() => {
			isReleasing = false;
		});
	}

	function handleRelease(event: PointerEvent | null) {
		if (!isDragging || !drawerNode) return;

		drawerNode.classList.remove(DRAG_CLASS);
		overlayNode?.classList.remove(DRAG_CLASS);
		isAllowedToDrag = false;
		isDragging = false;
		const swipeAmount = getTranslate(drawerNode, opts.direction.current);

		if (!event || (event.target && !shouldDrag(event.target, false)) || !swipeAmount || Number.isNaN(swipeAmount)) {
			return;
		}

		if (dragStartTime === null) return;

		const timeTaken = event.timeStamp - dragStartTime;
		const distMoved = pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX);
		const velocity = Math.abs(distMoved) / timeTaken;

		if (velocity > 0.05) {
			// `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
			justReleased = true;

			setTimeout(() => {
				justReleased = false;
			}, 200);
		}

		if (opts.snapPoints.current) {
			const directionMultiplier = opts.direction.current === 'bottom' || opts.direction.current === 'right' ? 1 : -1;
			snapPointsState.onRelease({
				draggedDistance: distMoved * directionMultiplier,
				closeDrawer,
				velocity,
				dismissible: opts.dismissible.current,
			});
			opts.onRelease.current?.(event, true);
			return;
		}

		// Moved upwards, don't do anything
		if (opts.direction.current === 'bottom' || opts.direction.current === 'right' ? distMoved > 0 : distMoved < 0) {
			resetDrawer();
			opts.onRelease.current?.(event, true);
			return;
		}

		if (velocity > VELOCITY_THRESHOLD) {
			closeDrawer();
			opts.onRelease.current?.(event, false);
			return;
		}

		const visibleDrawerHeight = Math.min(drawerNode.getBoundingClientRect().height ?? 0, window.innerHeight);
		const visibleDrawerWidth = Math.min(drawerNode.getBoundingClientRect().width ?? 0, window.innerWidth);

		const isHorizontalSwipe = opts.direction.current === 'left' || opts.direction.current === 'right';
		if (Math.abs(swipeAmount) >= (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * opts.closeThreshold.current) {
			closeDrawer();
			opts.onRelease.current?.(event, false);
			return;
		}

		opts.onRelease.current?.(event, true);
		resetDrawer();
	}

	$effect(() => {
		const _open = opts.open.current;

		return untrack(() => {
			if (!opts.open.current) return;

			openTime = performance.now();

			return assignStyle(document.documentElement, {
				scrollBehavior: 'auto',
			});
		});
	});

	function onNestedOpenChange(o: boolean) {
		const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;

		const initialTranslate = o ? -NESTED_DISPLACEMENT : 0;

		nestedTransitionCleanup?.();

		applyStyle(drawerNode, {
			transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
			transform: isVertical(opts.direction.current)
				? `scale(${scale}) translate3d(0, ${initialTranslate}px, 0)`
				: `scale(${scale}) translate3d(${initialTranslate}px, 0, 0)`,
		});

		if (!o && drawerNode) {
			// Freeze the un-scale transition's end state as a plain translate once it actually
			// finishes; a canceled transition (a new drag grabbed the node) must not be frozen.
			const node = drawerNode;
			const offEnd = on(node, 'transitionend', (e) => {
				if (e.target !== node || e.propertyName !== 'transform') return;
				cleanup();
				const translateValue = getTranslate(node, opts.direction.current);
				applyStyle(node, {
					transition: 'none',
					transform: isVertical(opts.direction.current)
						? `translate3d(0, ${translateValue}px, 0)`
						: `translate3d(${translateValue}px, 0, 0)`,
				});
			});
			const offCancel = on(node, 'transitioncancel', (e) => {
				if (e.target !== node || e.propertyName !== 'transform') return;
				cleanup();
			});
			const cleanup = () => {
				offEnd();
				offCancel();
				nestedTransitionCleanup = null;
			};
			nestedTransitionCleanup = cleanup;
		}
	}

	function onNestedDrag(_event: PointerEvent, percentageDragged: number) {
		if (percentageDragged < 0) return;

		const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
		const newScale = initialScale + percentageDragged * (1 - initialScale);
		const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;

		applyStyle(drawerNode, {
			transform: isVertical(opts.direction.current)
				? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)`
				: `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
			transition: 'none',
		});
	}

	function onNestedRelease(_event: PointerEvent, o: boolean) {
		const dim = isVertical(opts.direction.current) ? window.innerHeight : window.innerWidth;
		const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
		const translate = o ? -NESTED_DISPLACEMENT : 0;

		if (o) {
			applyStyle(drawerNode, {
				transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
				transform: isVertical(opts.direction.current)
					? `scale(${scale}) translate3d(0, ${translate}px, 0)`
					: `scale(${scale}) translate3d(${translate}px, 0, 0)`,
			});
		}
	}

	let bodyStyles = '';

	function handleOpenChange(o: boolean) {
		opts.onOpenChange.current?.(o);
		if (o && !opts.nested.current) {
			bodyStyles = document.body.style.cssText;
		}

		if (!o && !opts.nested.current) {
			restorePositionSetting();
		}

		if (o && !opts.modal.current) {
			window.requestAnimationFrame(() => {
				document.body.style.pointerEvents = 'auto';
			});
		}

		if (!o) {
			// Restored with the rest of body styles after the exit animation completes.
			document.body.style.pointerEvents = 'auto';
		}
	}

	function handleOpenChangeComplete(o: boolean) {
		if (!o && opts.snapPoints.current && opts.snapPoints.current.length > 0) {
			opts.activeSnapPoint.current = opts.snapPoints.current[0]!;
		}

		if (!o && !opts.nested.current) {
			document.body.style.cssText = bodyStyles;
		}

		opts.onAnimationEnd.current?.(o);
	}

	$effect(() => {
		const _modal = opts.modal.current;
		untrack(() => {
			if (!opts.modal.current) {
				window.requestAnimationFrame(() => {
					document.body.style.pointerEvents = 'auto';
				});
			}
		});
	});

	function setOverlayNode(node: HTMLElement | null) {
		overlayNode = node;
	}

	function setDrawerNode(node: HTMLElement | null) {
		drawerNode = node;
	}

	// Only what descendants (getDrawer) and the root component actually read; the
	// machine's remaining locals stay private.
	const ctx = {
		open: opts.open,
		snapPoints: opts.snapPoints,
		modal: opts.modal,
		direction: opts.direction,
		shouldScaleBackground: opts.shouldScaleBackground,
		setBackgroundColorOnScale: opts.setBackgroundColorOnScale,
		noBodyStyles: opts.noBodyStyles,
		handleOnly: opts.handleOnly,
		container: opts.container,
		autoFocus: opts.autoFocus,
		keyboardIsOpen,
		setDrawerNode,
		setOverlayNode,
		onPress,
		onDrag,
		onRelease,
		onNestedDrag,
		onNestedOpenChange,
		onNestedRelease,
		onDialogOpenChange,
		handleOpenChangeComplete,
		get shouldAnimate() {
			return shouldAnimate;
		},
		get shouldFade() {
			return snapPointsState.shouldFade;
		},
		get snapPointsOffset() {
			return snapPointsState.snapPointsOffset;
		},
		get activeSnapPointIndex() {
			return snapPointsState.activeSnapPointIndex;
		},
	};
	setDrawer(ctx);
	return ctx;
}
