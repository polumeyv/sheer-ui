import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { CarouselOrientation } from '../carousel/carouselState.svelte';

export type CarouselAlign = 'start' | 'center' | 'end';

// Internal wiring between Root and Content/Item; the public consumer surface is
// the shared CarouselContext from ../carousel, which Root also provides so the
// arrow components and dot UIs work against either implementation.
export type CarouselNativeContext = {
	readonly orientation: CarouselOrientation;
	readonly align: CarouselAlign;
	scroller: Attachment<HTMLElement>;
};

export const [getCarouselNativeContext, setCarouselNativeContext] = createContext<CarouselNativeContext>();
