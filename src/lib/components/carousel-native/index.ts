import Root from './carousel-native.svelte';
import Content from './carousel-native-content.svelte';
import Item from './carousel-native-item.svelte';
import Previous from '../carousel/carousel-previous.svelte';
import Next from '../carousel/carousel-next.svelte';

export type { CarouselAlign } from './carouselNativeState.svelte';

export {
	Root,
	Content,
	Item,
	Previous,
	Next,
	//
	Root as CarouselNative,
	Content as CarouselNativeContent,
	Item as CarouselNativeItem,
	Previous as CarouselNativePrevious,
	Next as CarouselNativeNext,
};
