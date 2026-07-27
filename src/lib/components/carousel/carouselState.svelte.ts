import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export type CarouselOrientation = 'horizontal' | 'vertical';
export type CarouselAlign = 'start' | 'center' | 'end';

/** Consumer-facing carousel state: what the arrow components and dot UIs read. */
export type CarouselContext = {
	readonly orientation: CarouselOrientation;
	readonly canScrollNext: boolean;
	readonly canScrollPrev: boolean;
	readonly scrollSnaps: number[];
	readonly selectedIndex: number;

	scrollNext: () => void;
	scrollPrev: () => void;
	scrollTo: (index: number, jump?: boolean) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
};

export const [getCarouselContext, setCarouselContext] = createContext<CarouselContext>();

/** Internal wiring between Root and Content/Item; not part of the consumer surface. */
export type CarouselWiring = {
	readonly orientation: CarouselOrientation;
	readonly align: CarouselAlign;
	scroller: Attachment<HTMLElement>;
};

export const [getCarouselWiring, setCarouselWiring] = createContext<CarouselWiring>();
