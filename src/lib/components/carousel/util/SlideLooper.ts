import { NumberStore, type NumberStoreType } from './NumberStore';
import { type TranslateType } from './Translate';

type SlideBoundType = {
	start: number;
	end: number;
};

type LoopPointType = {
	loopPoint: number;
	index: number;
	translate: TranslateType;
	slideLocation: NumberStoreType;
	target: () => number;
};

export type SlideLooperType = {
	canLoop: () => boolean;
	loop: () => void;
	loopPoints: LoopPointType[];
};

export const SlideLooper = (
	viewSize: number,
	contentSize: number,
	slideSizes: number[],
	slideSizesWithGaps: number[],
	snaps: number[],
	scrollSnaps: number[],
	location: NumberStoreType,
	slideTranslates: TranslateType[],
): SlideLooperType => {
	const roundingSafety = 0.5;
	const ascItems = Object.keys(slideSizesWithGaps).map(Number);
	const descItems = Object.keys(slideSizesWithGaps).map(Number).reverse();

	const getRemainingGapAfterSlides = (indexes: number[], from: number): number =>
		indexes.reduce((remainingGap: number, index) => {
			return remainingGap - slideSizesWithGaps[index]!;
		}, from);

	const getSlidesThatFitGap = (indexes: number[], gap: number): number[] =>
		indexes.reduce((slidesThatFit: number[], index) => {
			const remainingGap = getRemainingGapAfterSlides(slidesThatFit, gap);
			return remainingGap > 0 ? [...slidesThatFit, index] : slidesThatFit;
		}, []);

	const getSlideBounds = (offset: number): SlideBoundType[] =>
		snaps.map((snap, index) => ({
			start: snap - slideSizes[index]! + roundingSafety + offset,
			end: snap + viewSize - roundingSafety + offset,
		}));

	const getLoopPoints = (indexes: number[], offset: number, isEndEdge: boolean): LoopPointType[] => {
		const slideBounds = getSlideBounds(offset);

		return indexes.map((index) => {
			const initial = isEndEdge ? 0 : -contentSize;
			const altered = isEndEdge ? contentSize : 0;
			const boundEdge = isEndEdge ? 'end' : 'start';
			const loopPoint = slideBounds[index]![boundEdge];

			return {
				index,
				loopPoint,
				slideLocation: NumberStore(-1),
				translate: slideTranslates[index]!,
				target: () => (location.get() > loopPoint ? initial : altered),
			};
		});
	};

	const startPoints = (): LoopPointType[] => {
		const gap = scrollSnaps[0]!;
		const indexes = getSlidesThatFitGap(descItems, gap);
		return getLoopPoints(indexes, contentSize, false);
	};

	const endPoints = (): LoopPointType[] => {
		const gap = viewSize - scrollSnaps[0]! - 1;
		const indexes = getSlidesThatFitGap(ascItems, gap);
		return getLoopPoints(indexes, -contentSize, true);
	};

	const loopPoints = [...startPoints(), ...endPoints()];

	const canLoop = (): boolean =>
		loopPoints.every(({ index }) => {
			const otherIndexes = ascItems.filter((i) => i !== index);
			return getRemainingGapAfterSlides(otherIndexes, viewSize) <= 0.1;
		});

	const loop = (): void => {
		loopPoints.forEach((loopPoint) => {
			const { target, translate, slideLocation } = loopPoint;
			const shiftLocation = target();
			if (shiftLocation === slideLocation.get()) return;
			translate.to(shiftLocation);
			slideLocation.set(shiftLocation);
		});
	};

	const self: SlideLooperType = {
		canLoop,
		loop,
		loopPoints,
	};
	return self;
};
