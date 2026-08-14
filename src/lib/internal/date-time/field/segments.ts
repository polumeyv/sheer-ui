import { isAnySegmentPart } from './helpers.js';
import { isHTMLElement } from '../../tools/utils/dom.js';
import { kbd } from '../../kbd.js';

const navigate = (e: KeyboardEvent, neighbors: { prev: HTMLElement | null; next: HTMLElement | null }) => {
	if (e.key === kbd.ARROW_LEFT) neighbors.prev?.focus();
	else if (e.key === kbd.ARROW_RIGHT) neighbors.next?.focus();
};

/**
 * Retrieves the next segment relative to the provided node, or null at the end.
 */
export const getNextSegment = (node: HTMLElement, segments: HTMLElement[]) => {
	const index = segments.indexOf(node);
	if (index === segments.length - 1 || index === -1) return null;
	return segments[index + 1]!;
};

/**
 * Retrieves the previous segment relative to the provided node, or null at the start.
 */
export const getPrevSegment = (node: HTMLElement, segments: HTMLElement[]) => {
	const index = segments.indexOf(node);
	if (index === 0 || index === -1) return null;
	return segments[index - 1]!;
};

/**
 * Retrieves all the interactive segments within the field.
 */
export const getSegments = (fieldNode: HTMLElement | null) => {
	if (!fieldNode) return [];
	return Array.from(fieldNode.querySelectorAll<HTMLElement>('[data-segment]')).filter((el) => {
		const segment = el.dataset.segment;
		return segment === 'trigger' || (isAnySegmentPart(segment) && segment !== 'literal');
	});
};

export const getTimeSegments = (fieldNode: HTMLElement | null) => {
	if (!fieldNode) return [];
	return Array.from(fieldNode.querySelectorAll<HTMLElement>('[data-segment]')).filter((el) => el.dataset.segment !== 'literal');
};

/**
 * Get the first interactive segment within the field.
 */
export const getFirstSegment = (fieldNode: HTMLElement | null) => getSegments(fieldNode)[0];

export const getFirstTimeSegment = (fieldNode: HTMLElement | null) => getTimeSegments(fieldNode)[0];

const prevNext = (startingNode: HTMLElement, segments: HTMLElement[]) => ({
	next: getNextSegment(startingNode, segments),
	prev: getPrevSegment(startingNode, segments),
});

/**
 * Retrieves the next and previous segments relative to the current node.
 */
const getPrevNextSegments = (startingNode: HTMLElement, fieldNode: HTMLElement | null) =>
	prevNext(startingNode, getSegments(fieldNode));

const getPrevNextTimeSegments = (startingNode: HTMLElement, fieldNode: HTMLElement | null) =>
	prevNext(startingNode, getTimeSegments(fieldNode));

/**
 * Handles segment navigation based on the provided keyboard event and field.
 */
export const handleSegmentNavigation = (e: KeyboardEvent, fieldNode: HTMLElement | null) => {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	navigate(e, getPrevNextSegments(node, fieldNode));
};

export const handleTimeSegmentNavigation = (e: KeyboardEvent, fieldNode: HTMLElement | null) => {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	navigate(e, getPrevNextTimeSegments(node, fieldNode));
};

const moveFocus = (e: KeyboardEvent, fieldNode: HTMLElement | null, getNeighbors: typeof getPrevNextSegments, dir: 'prev' | 'next') => {
	const node = e.currentTarget;
	if (!isHTMLElement(node)) return;
	getNeighbors(node, fieldNode)[dir]?.focus();
};

export const moveToPrevSegment = (e: KeyboardEvent, fieldNode: HTMLElement | null) => moveFocus(e, fieldNode, getPrevNextSegments, 'prev');
export const moveToNextSegment = (e: KeyboardEvent, fieldNode: HTMLElement | null) => moveFocus(e, fieldNode, getPrevNextSegments, 'next');

export const isSegmentNavigationKey = (key: string) => key === kbd.ARROW_RIGHT || key === kbd.ARROW_LEFT;
