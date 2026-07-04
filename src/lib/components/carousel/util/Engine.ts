import { Alignment } from './Alignment';
import { Animations, type AnimationsType } from './Animations';
import { Axis, type AxisType } from './Axis';
import { Counter, type CounterType } from './Counter.svelte';
import { DragHandler, type DragHandlerType } from './DragHandler';
import { DragTracker } from './DragTracker';
import { type EventHandlerType } from './EventHandler';
import { EventStore, type EventStoreType } from './EventStore';
import { type LimitType } from './Limit';
import { type NodeHandlerType, type NodeRectsType, type NodeRectType } from './NodeHandler';
import { type OptionsType } from './Options';
import { PercentOfView, type PercentOfViewType } from './PercentOfView';
import { ResizeHandler, type ResizeHandlerType } from './ResizeHandler';
import { ScrollAnimator } from './ScrollAnimator';
import { ScrollBody, type ScrollBodyType } from './ScrollBody';
import { ScrollBounds, type ScrollBoundsType } from './ScrollBounds';
import { ScrollContain } from './ScrollContain';
import { ScrollLimit } from './ScrollLimit';
import { ScrollLooper, type ScrollLooperType } from './ScrollLooper';
import { ScrollProgress, type ScrollProgressType } from './ScrollProgress';
import { ScrollSnaps } from './ScrollSnaps';
import { ScrollSnapList, type ScrollSnapListType } from './ScrollSnapList';
import { ScrollTarget, type ScrollTargetType } from './ScrollTarget';
import { ScrollTo, type ScrollToType } from './ScrollTo';
import { SlideFocus, type SlideFocusType } from './SlideFocus';
import { SlideLooper, type SlideLooperType } from './SlideLooper';
import { SlidesHandler, type SlidesHandlerType } from './SlidesHandler';
import { SlidesInView, type SlidesInViewType } from './SlidesInView.svelte';
import { SlideSizes } from './SlideSizes';
import { SlidesToScroll, type SlidesToScrollType } from './SlidesToScroll';
import { Translate, type TranslateType } from './Translate';
import { arrayLastIndex } from './utils';
import { NumberStore, type NumberStoreType } from './NumberStore';

export type ReInitApi = {
	reInit: () => void;
};

export type EngineType<API extends ReInitApi = ReInitApi> = {
	isSsr: boolean;
	eventHandler: EventHandlerType<API>;
	contentSize: number;
	axis: AxisType;
	animation: AnimationsType;
	scrollBounds: ScrollBoundsType;
	scrollLooper: ScrollLooperType;
	scrollProgress: ScrollProgressType;
	indexCurrent: CounterType;
	indexPrevious: CounterType;
	limit: LimitType;
	location: NumberStoreType;
	offsetLocation: NumberStoreType;
	previousLocation: NumberStoreType;
	options: OptionsType;
	percentOfView: PercentOfViewType;
	scrollBody: ScrollBodyType;
	dragHandler: DragHandlerType;
	eventStore: EventStoreType;
	slideLooper: SlideLooperType;
	slidesInView: SlidesInViewType;
	slidesToScroll: SlidesToScrollType;
	target: NumberStoreType;
	translate: TranslateType;
	slideTranslates: TranslateType[];
	resizeHandler: ResizeHandlerType;
	slidesHandler: SlidesHandlerType;
	nodeHandler: NodeHandlerType;
	scrollTo: ScrollToType;
	scrollTarget: ScrollTargetType;
	scrollSnaps: number[];
	slideIndexes: number[];
	slideSizes: number[];
	slideFocus: SlideFocusType;
	scrollSnapList: ScrollSnapListType;
	containerRect: NodeRectType;
	slideRects: NodeRectType[];
};

export const Engine = <API extends ReInitApi>(
	root: HTMLElement,
	container: HTMLElement,
	slides: HTMLElement[],
	options: OptionsType,
	nodeHandler: NodeHandlerType,
	eventHandler: EventHandlerType<API>,
	rects: NodeRectsType,
	isSsr: boolean,
): EngineType<API> => {
	const {
		align,
		axis: scrollAxis,
		direction,
		startSnap,
		loop,
		duration,
		dragFree,
		dragThreshold,
		inViewThreshold,
		inViewMargin,
		slidesToScroll: groupSlides,
		skipSnaps,
		containScroll,
		draggable,
		resize,
		slideChanges,
		focus,
	} = options;

	const pixelTolerance = isSsr ? 0 : 2;
	const axis = Axis(scrollAxis, direction);
	const { containerRect, slideRects } = rects;
	const viewSize = axis.getSize(containerRect);
	const percentOfView = PercentOfView(viewSize);
	const alignment = Alignment(align, viewSize);
	const containSnaps = !loop && !!containScroll;
	const readEdgeGap = loop || !!containScroll;

	const { slideSizes, slideSizesWithGaps, startGap, endGap } = SlideSizes(
		axis,
		containerRect,
		slideRects,
		slides,
		readEdgeGap,
		nodeHandler,
	);

	const slidesToScroll = SlidesToScroll(axis, viewSize, groupSlides, loop, containerRect, slideRects, startGap, endGap, pixelTolerance);

	const { snaps, snapsAligned } = ScrollSnaps(axis, alignment, containerRect, slideRects, slidesToScroll);

	const contentSize = -snaps.at(-1)! + slideSizesWithGaps.at(-1)!;

	const { snapsContained, scrollContainLimit } = ScrollContain(viewSize, contentSize, snapsAligned, containScroll, pixelTolerance);

	const scrollSnaps = containSnaps ? snapsContained : snapsAligned;
	const { limit } = ScrollLimit(contentSize, scrollSnaps, loop);

	const indexCurrent = Counter(arrayLastIndex(scrollSnaps), startSnap, loop);
	const indexPrevious = Counter(arrayLastIndex(scrollSnaps), startSnap, loop);
	const slideIndexes = [...slides.keys()];

	const scrollAnimator = ScrollAnimator<API>();
	const animation = Animations(
		() => scrollAnimator.update(engine),
		(alpha: number) => scrollAnimator.render(engine, alpha),
	);

	const friction = 0.68;
	const startLocation = scrollSnaps[indexCurrent.get()]!;
	const location = NumberStore(startLocation);
	const previousLocation = NumberStore(startLocation);
	const offsetLocation = NumberStore(startLocation);
	const target = NumberStore(startLocation);
	const translate = Translate(axis, container);
	const slideTranslates = slides.map((slide) => Translate(axis, slide));

	const scrollProgress = ScrollProgress(limit);

	const scrollBody = ScrollBody(location, offsetLocation, previousLocation, target, duration, friction);

	const scrollSnapList = ScrollSnapList(
		containSnaps,
		containScroll,
		scrollSnaps,
		scrollContainLimit,
		slidesToScroll,
		slideIndexes,
		scrollProgress,
	);

	const slideLooper = SlideLooper(
		viewSize,
		contentSize,
		slideSizes,
		slideSizesWithGaps,
		snaps,
		scrollSnaps,
		offsetLocation,
		slideTranslates,
	);

	const scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target);

	const scrollTo = ScrollTo(animation, indexCurrent, indexPrevious, scrollBody, scrollTarget, target, eventHandler);

	const eventStore = EventStore();

	const slidesInView = SlidesInView(container, slides, eventHandler, inViewThreshold, inViewMargin);

	const slideFocus = SlideFocus(axis, focus, root, slides, scrollSnapList, scrollTo, scrollBody, eventStore, eventHandler);

	const engine: EngineType<API> = {
		eventHandler,
		containerRect,
		contentSize,
		slideRects,
		nodeHandler,
		animation,
		slideSizes,
		isSsr,
		axis,
		dragHandler: DragHandler(
			draggable,
			axis,
			root,
			target,
			DragTracker(axis),
			location,
			animation,
			scrollTo,
			scrollBody,
			scrollTarget,
			indexCurrent,
			eventHandler,
			percentOfView,
			dragFree,
			dragThreshold,
			skipSnaps,
			friction,
		),
		eventStore,
		percentOfView,
		indexCurrent,
		indexPrevious,
		limit,
		location,
		offsetLocation,
		previousLocation,
		options,
		resizeHandler: ResizeHandler(resize, container, eventHandler, slides, axis, nodeHandler),
		scrollBody,
		scrollBounds: ScrollBounds(limit, offsetLocation, target, scrollBody, percentOfView),
		scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [location, offsetLocation, previousLocation, target]),
		scrollProgress,
		scrollSnaps,
		scrollTarget,
		scrollTo,
		slideLooper,
		slideFocus,
		slidesHandler: SlidesHandler(slideChanges, container, eventHandler),
		slidesInView,
		slideIndexes,
		slidesToScroll,
		slideTranslates,
		scrollSnapList,
		translate,
		target,
	};

	return engine;
};
