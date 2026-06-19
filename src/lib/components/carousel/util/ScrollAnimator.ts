import type { EngineType, ReInitApi } from './Engine';

export type ScrollEventType = {
	isDragging: boolean;
};

export type ScrollAnimatorType<API extends ReInitApi = ReInitApi> = {
	update: (engine: EngineType<API>) => void;
	render: (engine: EngineType<API>, alpha: number) => void;
};

export function ScrollAnimator<API extends ReInitApi>(): ScrollAnimatorType<API> {
	function update(engine: EngineType<API>): void {
		const {
			dragHandler,
			scrollBody,
			scrollBounds,
			options: { loop },
		} = engine;

		if (!loop) scrollBounds.constrain(dragHandler.pointerDown());

		scrollBody.seek();
	}

	function render(engine: EngineType<API>, alpha: number): void {
		const {
			scrollBody,
			translate,
			location,
			offsetLocation,
			previousLocation,
			scrollLooper,
			slideLooper,
			dragHandler,
			animation,
			eventHandler,
			scrollBounds,
			options: { loop },
		} = engine;

		const isIdle = scrollBody.settled();
		const isWithinBounds = !scrollBounds.shouldConstrain();
		const isPointerDown = dragHandler.pointerDown();

		const canSettle = loop || isWithinBounds;
		const isIdleAndCanSettle = isIdle && canSettle;

		const isScrolling = !isIdleAndCanSettle;
		const isDragging = isScrolling && isPointerDown;
		const isSettled = isIdleAndCanSettle && !isPointerDown;

		if (isSettled) {
			animation.stop();
		}

		const interpolatedLocation = location.get() * alpha + previousLocation.get() * (1 - alpha);

		offsetLocation.set(interpolatedLocation);

		if (loop) {
			scrollLooper.loop(scrollBody.direction());
			slideLooper.loop();
		}

		translate.to(offsetLocation);

		if (isSettled) {
			eventHandler.createEvent('settle', null).emit();
		}

		if (isScrolling) {
			eventHandler.createEvent('scroll', { isDragging }).emit();
		}
	}

	const self: ScrollAnimatorType<API> = {
		update,
		render,
	};

	return self;
}
