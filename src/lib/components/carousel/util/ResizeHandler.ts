import { type AxisType } from './Axis';
import { type EventHandlerType } from './EventHandler';
import { type NodeHandlerType } from './NodeHandler';
import { type WindowType } from './utils';

type ReInitApi = {
	reInit: () => void;
};

export type ResizeHandlerType = {
	init: (ownerWindow: WindowType) => void;
	destroy: () => void;
};

export const ResizeHandler = <API extends ReInitApi>(
	active: boolean,
	container: HTMLElement,
	eventHandler: EventHandlerType<API>,
	slides: HTMLElement[],
	axis: AxisType,
	nodeHandler: NodeHandlerType,
): ResizeHandlerType => {
	const observeNodes = [container, ...slides];
	let resizeObserver: ResizeObserver;
	let containerSize: number;
	let slideSizes: number[] = [];
	let destroyed = false;

	const readSize = (node: HTMLElement): number => axis.getSize(nodeHandler.getRect(node));

	const init = (ownerWindow: WindowType): void => {
		if (!active) return;

		containerSize = readSize(container);
		slideSizes = slides.map(readSize);

		resizeObserver = new ownerWindow.ResizeObserver(onResize);

		ownerWindow.requestAnimationFrame(() => {
			observeNodes.forEach((node) => resizeObserver.observe(node));
		});
	};

	const destroy = (): void => {
		destroyed = true;
		if (resizeObserver) resizeObserver.disconnect();
	};

	const onResize = (entries: ResizeObserverEntry[]): void => {
		const event = eventHandler.createEvent('resize', entries);
		const preventDefault = !event.emit();

		if (preventDefault) return;

		for (const entry of entries) {
			if (destroyed) return;

			const isContainer = entry.target === container;
			const slideIndex = slides.indexOf(entry.target as HTMLElement);
			const lastSize = isContainer ? containerSize : slideSizes[slideIndex]!;

			const newSize = readSize(isContainer ? container : slides[slideIndex]!);
			const diffSize = Math.abs(newSize - lastSize);

			if (diffSize >= 0.5) {
				event.api.reInit();
				break;
			}
		}
	};

	const self: ResizeHandlerType = {
		init,
		destroy,
	};

	return self;
};
