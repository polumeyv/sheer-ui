import { createContext, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType, type EmblaPluginType } from 'embla-carousel';
import type { WithElementRef } from '../../vendor/utils';

export type CarouselAPI = EmblaCarouselType;
export type CarouselOptions = EmblaOptionsType;
export type CarouselPlugins = EmblaPluginType[];
export type CarouselOrientation = 'horizontal' | 'vertical';

export type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugins;
	setApi?: (api: CarouselAPI | undefined) => void;
	orientation?: CarouselOrientation;
} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

export type CarouselContext = {
	readonly api: CarouselAPI | undefined;
	readonly orientation: CarouselOrientation;
	readonly options: CarouselOptions;
	readonly plugins: CarouselPlugins;
	readonly canScrollNext: boolean;
	readonly canScrollPrev: boolean;
	readonly scrollSnaps: number[];
	readonly selectedIndex: number;

	registerApi: (api: CarouselAPI | undefined) => void;
	scrollNext: () => void;
	scrollPrev: () => void;
	scrollTo: (index: number, jump?: boolean) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
};

export const [getEmblaContext, setEmblaContext] = createContext<CarouselContext>();

export type EmblaCarouselConfig = {
	options?: EmblaOptionsType;
	plugins?: EmblaPluginType[];
};

type EmblaCarouselConfigGetter = () => EmblaCarouselConfig | undefined;

type UseEmblaCarouselFactory = {
	(getConfig?: EmblaCarouselConfigGetter, onInit?: (api: CarouselAPI) => void, onDestroy?: () => void): Attachment<HTMLElement>;
	globalOptions: EmblaOptionsType | undefined;
};

const emptyOptions: EmblaOptionsType = {};
const emptyPlugins: EmblaPluginType[] = [];

function readConfig(getConfig?: EmblaCarouselConfigGetter) {
	const config = getConfig?.();

	return {
		options: config?.options ?? emptyOptions,
		plugins: config?.plugins ?? emptyPlugins,
	};
}

const useEmblaCarousel: UseEmblaCarouselFactory = Object.assign(
	(getConfig?: EmblaCarouselConfigGetter, onInit?: (api: CarouselAPI) => void, onDestroy?: () => void): Attachment<HTMLElement> =>
		(node) => {
			EmblaCarousel.globalOptions = useEmblaCarousel.globalOptions;

			const initialConfig = untrack(() => readConfig(getConfig));
			const api = EmblaCarousel(node, initialConfig.options, initialConfig.plugins);

			untrack(() => onInit?.(api));

			let initialized = false;

			$effect(() => {
				const config = readConfig(getConfig);

				if (initialized) {
					api.reInit(config.options, config.plugins);
				}

				initialized = true;
			});

			return () => {
				untrack(() => onDestroy?.());
				api.destroy();
			};
		},
	{
		globalOptions: undefined,
	},
);

export default useEmblaCarousel;
