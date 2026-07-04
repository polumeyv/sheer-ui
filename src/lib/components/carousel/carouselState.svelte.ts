import { createContext, untrack } from "svelte";
import type { Attachment } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';
import { EventHandler, type EventHandlerType } from '../../internal/vendor/embla/EventHandler';
import { Engine, type EngineType } from '../../internal/vendor/embla/Engine';
import { defaultOptions, type CarouselOptionsType, type CreateOptionsType, type LooseOptionsType, type OptionsType } from '../../internal/vendor/embla/Options';
import { NodeHandler, type NodeHandlerType } from '../../internal/vendor/embla/NodeHandler';
import { observeOptionsBreakpoints, OptionsHandler, type OptionsHandlerType } from '../../internal/vendor/embla/OptionsHandler';
import { type ScrollToDirectionType } from '../../internal/vendor/embla/ScrollTo';

import type { WithElementRef } from "../../internal/utils.js";

export type LoosePluginType = {
	[key: string]: unknown;
};

export type CreatePluginType<TypeA extends LoosePluginType, TypeB extends LooseOptionsType> = TypeA & {
	name: string;
	options: Partial<CreateOptionsType<TypeB>>;
	init: (carouselApi: CarouselAPI, optionsHandler: OptionsHandlerType) => void;
	destroy: () => void;
};

export interface CarouselPluginsType {
	[key: string]: CreatePluginType<LoosePluginType, LooseOptionsType> | undefined;
}
export type CarouselPlugin = NonNullable<CarouselPluginsType[keyof CarouselPluginsType]>;

export type CarouselOptions = CarouselOptionsType;
export type CarouselPlugins = CarouselPlugin[];
export type CarouselOrientation = 'horizontal' | 'vertical';

export type CarouselAPI = {
	canGoToNext: () => boolean;
	canGoToPrev: () => boolean;
	goToNext: (instant?: boolean) => void;
	goToPrev: (instant?: boolean) => void;
	goTo: (index: number, instant?: boolean, direction?: ScrollToDirectionType) => void;
	previousSnap: () => number;
	selectedSnap: () => number;
	rootNode: () => HTMLElement;
	containerNode: () => HTMLElement;
	slideNodes: () => HTMLElement[];
	snapIndex: (offset: number) => number;
	snapList: () => number[];
	destroy: () => void;
	createEvent: EventHandlerType<CarouselAPI>['createEvent'];
	on: EventHandlerType<CarouselAPI>['on'];
	off: EventHandlerType<CarouselAPI>['off'];
	internalEngine: () => EngineType<CarouselAPI>;
	cloneEngine: (userOptions?: CarouselOptions) => EngineType<CarouselAPI>;
	plugins: () => CarouselPluginsType;
	reInit: (options?: CarouselOptions, plugins?: CarouselPlugins) => void;
	scrollProgress: () => number;
	slidesInView: () => number[];
};

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

export const [getCarouselContext, setCarouselContext] = createContext<CarouselContext>();

type CarouselConfig = {
	options?: CarouselOptions;
	plugins?: CarouselPlugins;
};

type GetCarouselConfig = () => CarouselConfig | undefined;
type SetCarouselApi = (api: CarouselAPI | undefined) => void;

const fallbackOptions: CarouselOptions = {};
const fallbackPlugins: CarouselPlugins = [];

const readCarouselConfig = (readConfig?: GetCarouselConfig) => {
	const config = readConfig?.();

	return {
		options: config?.options ?? fallbackOptions,
		plugins: config?.plugins ?? fallbackPlugins,
	};
};

const createCarousel = (userRoot: HTMLElement, userOptions: CarouselOptions = {}, userPlugins: CarouselPlugins = []): CarouselAPI => {
	const optionsHandler = OptionsHandler();
	let activePlugins: CarouselPlugins = [];
	let pluginList = userPlugins;
	let pluginApis: CarouselPluginsType = {};
	const eventHandler = EventHandler<CarouselAPI>();

	const { mergeOptions, optionsAtMedia } = optionsHandler;
	const { on, off, createEvent } = eventHandler;

	let destroyed = false;
	// Swapped on every (re)activation; reactive so snap list / index reads re-derive after reInit.
	let engine = $state.raw() as EngineType<CarouselAPI>;
	let nodeHandler: NodeHandlerType;

	let optionsBase = mergeOptions(defaultOptions, userOptions);
	let options = mergeOptions(optionsBase);

	let root: HTMLElement;
	let container: HTMLElement;
	let slides: HTMLElement[];

	const cloneEngine = (userOptions?: CarouselOptions): EngineType<CarouselAPI> => {
		const engineOptions = mergeOptions(options, userOptions);
		return createEngine(engineOptions, container, slides, true);
	};

	const createEngine = (
		options: OptionsType,
		container: HTMLElement,
		slides: HTMLElement[],
		useCachedRects?: boolean,
	): EngineType<CarouselAPI> => {
		const rects = nodeHandler.getRects(container, slides, useCachedRects);

		const nextEngine = Engine<CarouselAPI>(root, container, slides, options, nodeHandler, eventHandler, rects, false);

		if (options.loop && !nextEngine.slideLooper.canLoop()) {
			return cloneEngine({ loop: false });
		}

		return nextEngine;
	};

	const initPlugins = (api: CarouselAPI, plugins: CarouselPlugins): CarouselPluginsType => {
		activePlugins = plugins;

		return plugins.reduce<CarouselPluginsType>((pluginList, plugin) => {
			plugin.init(api, optionsHandler);
			pluginList[plugin.name] = plugin;
			return pluginList;
		}, {});
	};

	const destroyPlugins = (): void => {
		activePlugins.forEach((plugin) => {
			plugin.destroy();
		});

		activePlugins = [];
	};

	const activate = (withOptions?: CarouselOptions, withPlugins?: CarouselPlugins): void => {
		if (destroyed) return;

		nodeHandler = NodeHandler(userRoot);

		const { ownerWindow } = nodeHandler;

		optionsBase = mergeOptions(optionsBase, withOptions);
		options = optionsAtMedia(optionsBase);
		pluginList = withPlugins ?? pluginList;

		const nodes = nodeHandler.getNodes(options);

		root = nodes.root;
		container = nodes.container;
		slides = nodes.slides;
		engine = createEngine(options, container, slides);

		if (!options.active) return;

		if (ownerWindow) {
			engine.translate.to(engine.location);

			if (engine.options.loop) {
				engine.slideLooper.loop();
			}

			engine.animation.init(ownerWindow);
			engine.resizeHandler.init(ownerWindow);
			engine.slidesInView.init(ownerWindow);
			engine.slidesHandler.init(ownerWindow);
			engine.slideFocus.init(ownerWindow);
			engine.eventHandler.init(self);

			if (container.offsetParent && slides.length) {
				engine.dragHandler.init(ownerWindow);
			}
		}

		pluginApis = initPlugins(self, pluginList);
	};

	const reActivate = (withOptions?: CarouselOptions, withPlugins?: CarouselPlugins): void => {
		const event = eventHandler.createEvent('reinit', null);
		const startSnap = selectedSnap();

		deActivate();
		activate(mergeOptions({ startSnap }, withOptions), withPlugins);

		event.emit();
	};

	const deActivate = (): void => {
		engine.dragHandler.destroy();
		engine.resizeHandler.destroy();
		engine.slidesHandler.destroy();
		engine.slidesInView.destroy();
		engine.animation.destroy();

		destroyPlugins();

		engine.eventStore.clear();
		engine.translate.clear();
		engine.slideTranslates.forEach((translate) => translate.clear());
	};

	const destroy = (): void => {
		if (destroyed) return;

		const event = eventHandler.createEvent('destroy', null);

		destroyed = true;

		deActivate();
		event.emit();
		eventHandler.clear();
	};

	const goTo = (index: number, instant?: boolean, direction?: ScrollToDirectionType): void => {
		if (destroyed) return;
		if (!options.active) return;

		engine.scrollBody.useBaseFriction().useDuration(instant === true ? 0 : options.duration);
		engine.scrollTo.index(index, direction);
	};

	const goToNext = (instant?: boolean): void => {
		goTo(snapIndex(1), instant, -1);
	};

	const goToPrev = (instant?: boolean): void => {
		goTo(snapIndex(-1), instant, 1);
	};

	const canGoToNext = (): boolean => {
		return snapIndex(1) !== selectedSnap();
	};

	const canGoToPrev = (): boolean => {
		return snapIndex(-1) !== selectedSnap();
	};

	const scrollProgress = (): number => {
		return engine.scrollProgress.get(engine.offsetLocation);
	};

	const snapIndex = (offset: number): number => {
		const { indexCurrent } = engine;
		return indexCurrent.normalize(indexCurrent.get() + offset);
	};

	const snapList = (): number[] => {
		return engine.scrollSnapList.progressBySnap;
	};

	const selectedSnap = (): number => {
		return snapIndex(0);
	};

	const previousSnap = (): number => {
		return engine.indexPrevious.get();
	};

	const slidesInView = (): number[] => {
		return engine.slidesInView.get();
	};

	const plugins = (): CarouselPluginsType => {
		return pluginApis;
	};

	const internalEngine = (): EngineType<CarouselAPI> => {
		return engine;
	};

	const rootNode = (): HTMLElement => {
		return root;
	};

	const containerNode = (): HTMLElement => {
		return container;
	};

	const slideNodes = (): HTMLElement[] => {
		return slides;
	};

	const self: CarouselAPI = {
		canGoToNext,
		canGoToPrev,
		cloneEngine,
		containerNode,
		createEvent,
		destroy,
		goTo,
		goToNext,
		goToPrev,
		internalEngine,
		off,
		on,
		plugins,
		previousSnap,
		reInit: reActivate,
		rootNode,
		scrollProgress,
		selectedSnap,
		slideNodes,
		slidesInView,
		snapIndex,
		snapList,
	};

	activate(userOptions, userPlugins);

	return self;
};

export const useCarousel = (readConfig?: GetCarouselConfig, setApi?: SetCarouselApi): Attachment<HTMLElement> => {
	return (node) => {
		const initial = untrack(() => readCarouselConfig(readConfig));
		// untrack: activation reads the reactive engine/counter state it creates; the
		// attachment must not become a dependent of it, or a reInit would re-attach.
		const api = untrack(() => createCarousel(node, initial.options, initial.plugins));

		untrack(() => setApi?.(api));

		let initialized = false;

		// Deliberately a post-DOM $effect, not $effect.pre: an orientation change
		// flips container classes in this same flush and reInit must measure the
		// new layout.
		$effect(() => {
			const next = readCarouselConfig(readConfig);

			// Track every declared breakpoint; a flip re-runs this effect and reInit
			// re-resolves optionsAtMedia against the new matches.
			observeOptionsBreakpoints([next.options, ...next.plugins.map((plugin) => plugin.options)]);

			if (initialized) {
				// untrack: reInit reads engine state it also swaps; this effect must only
				// depend on the config and the breakpoints observed above.
				untrack(() => api.reInit(next.options, next.plugins));
			}

			initialized = true;
		});

		return () => {
			untrack(() => setApi?.(undefined));
			api.destroy();
		};
	};
};
