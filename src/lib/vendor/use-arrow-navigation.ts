import type { Direction } from '$lib/shared/index';

type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both';

interface ArrowNavigationOptions {
	/**
	 * The arrow key options to allow navigation.
	 *
	 * @defaultValue "both"
	 */
	arrowKeyOptions?: ArrowKeyOptions;

	/**
	 * The selector used to find candidate items inside the parent element.
	 */
	candidateSelector: string;

	/**
	 * Candidate items to use when no parent element is provided.
	 *
	 * @defaultValue []
	 */
	itemsArray?: HTMLElement[];

	/**
	 * Allow loop navigation. If false, navigation stops at the first and last element.
	 *
	 * @defaultValue true
	 */
	loop?: boolean;

	/**
	 * Text direction. Used to reverse left/right behavior in RTL layouts.
	 *
	 * @defaultValue "ltr"
	 */
	dir?: Direction;

	/**
	 * Prevent browser scrolling when navigating.
	 *
	 * @defaultValue true
	 */
	preventScroll?: boolean;

	/**
	 * If true, ignored elements like inputs and textareas do not trigger navigation.
	 *
	 * @defaultValue false
	 */
	enableIgnoredElement?: boolean;

	/**
	 * Focus the navigated element automatically.
	 *
	 * @defaultValue false
	 */
	focus?: boolean;
}

const ignoredElements = ['INPUT', 'TEXTAREA'];

export function useArrowNavigation(
	e: KeyboardEvent,
	currentElement: HTMLElement,
	parentElement: HTMLElement | undefined,
	options: ArrowNavigationOptions,
): HTMLElement | null {
	if (options.enableIgnoredElement && ignoredElements.includes(currentElement.nodeName)) {
		return null;
	}

	const {
		arrowKeyOptions = 'both',
		candidateSelector,
		itemsArray = [],
		loop = true,
		dir = 'ltr',
		preventScroll = true,
		focus = false,
	} = options;

	const isRight = e.key === 'ArrowRight';
	const isLeft = e.key === 'ArrowLeft';
	const isUp = e.key === 'ArrowUp';
	const isDown = e.key === 'ArrowDown';
	const isHome = e.key === 'Home';
	const isEnd = e.key === 'End';

	const goingVertical = isUp || isDown;
	const goingHorizontal = isRight || isLeft;

	if (
		!isHome &&
		!isEnd &&
		((!goingVertical && !goingHorizontal) ||
			(arrowKeyOptions === 'vertical' && goingHorizontal) ||
			(arrowKeyOptions === 'horizontal' && goingVertical))
	) {
		return null;
	}

	const candidates = parentElement ? Array.from(parentElement.querySelectorAll<HTMLElement>(candidateSelector)) : itemsArray;

	if (!candidates.length) return null;

	if (preventScroll) {
		e.preventDefault();
	}

	let nextElement: HTMLElement | null = null;

	if (goingHorizontal || goingVertical) {
		const goForward = goingVertical ? isDown : dir === 'ltr' ? isRight : isLeft;

		nextElement = findNextFocusableElement(candidates, currentElement, {
			goForward,
			loop,
		});
	} else if (isHome) {
		nextElement = candidates.at(0) ?? null;
	} else if (isEnd) {
		nextElement = candidates.at(-1) ?? null;
	}

	if (focus) {
		nextElement?.focus();
	}

	return nextElement;
}

function findNextFocusableElement(
	elements: HTMLElement[],
	currentElement: HTMLElement,
	{ goForward, loop }: { goForward: boolean; loop: boolean },
	iterations = elements.length,
): HTMLElement | null {
	if (--iterations === 0) return null;

	const currentIndex = elements.indexOf(currentElement);
	const nextIndex = goForward ? currentIndex + 1 : currentIndex - 1;

	if (!loop && (nextIndex < 0 || nextIndex >= elements.length)) {
		return null;
	}

	const adjustedIndex = (nextIndex + elements.length) % elements.length;
	const candidate = elements[adjustedIndex];

	if (!candidate) return null;

	const isDisabled =
		(candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false') ||
		candidate.hasAttribute('data-disabled') ||
		candidate.getAttribute('aria-disabled') === 'true';

	if (isDisabled) {
		return findNextFocusableElement(elements, candidate, { goForward, loop }, iterations);
	}

	return candidate;
}
