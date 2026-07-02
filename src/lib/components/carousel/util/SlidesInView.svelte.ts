import type { EventHandlerType } from './EventHandler';
import type { WindowType } from './utils';

export type SlidesInViewThresholdOptionsType = IntersectionObserverInit['threshold'];

export type SlidesInViewMarginOptionsType = IntersectionObserverInit['rootMargin'];

export type SlidesInViewEventType = {
	slidesInView: number[];
	slidesLeftView: number[];
	slidesEnterView: number[];
};

export type SlidesInViewType = {
	init: (ownerWindow: WindowType) => void;
	destroy: () => void;
	get: () => number[];
};

export const SlidesInView = <API>(
	container: HTMLElement,
	slides: HTMLElement[],
	eventHandler: EventHandlerType<API>,
	threshold: SlidesInViewThresholdOptionsType,
	rootMargin: SlidesInViewMarginOptionsType,
): SlidesInViewType => {
	const slidesInView = new Set<number>();
	// Reactive snapshot so get() composes into deriveds; written once per
	// IntersectionObserver callback, never per animation frame.
	let inView = $state.raw<number[]>([]);
	let intersectionObserver: IntersectionObserver;
	let destroyed = false;

	const init = (ownerWindow: WindowType): void => {
		intersectionObserver = new ownerWindow.IntersectionObserver(onIntersection, {
			root: container.parentElement,
			threshold,
			rootMargin,
		});

		slides.forEach((slide) => intersectionObserver.observe(slide));
	};

	const destroy = (): void => {
		if (intersectionObserver) intersectionObserver.disconnect();
		destroyed = true;
	};

	const onIntersection = (entries: IntersectionObserverEntry[]): void => {
		const slidesEnterView: number[] = [];
		const slidesLeftView: number[] = [];

		for (const entry of entries) {
			if (destroyed) return;

			const index = slides.indexOf(entry.target as HTMLElement);

			if (entry.isIntersecting) {
				slidesInView.add(index);
				slidesEnterView.push(index);
			} else {
				slidesInView.delete(index);
				slidesLeftView.push(index);
			}
		}

		inView = [...slidesInView];

		eventHandler
			.createEvent('slidesinview', {
				slidesInView: get(),
				slidesLeftView,
				slidesEnterView,
			})
			.emit();
	};

	const get = (): number[] => inView;

	const self: SlidesInViewType = {
		init,
		destroy,
		get,
	};

	return self;
};
