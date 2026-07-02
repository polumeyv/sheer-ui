import { type NumberStoreType } from './NumberStore';

export type ScrollBodyType = {
	direction: () => number;
	duration: () => number;
	velocity: () => number;
	seek: () => ScrollBodyType;
	settled: () => boolean;
	useBaseFriction: () => ScrollBodyType;
	useBaseDuration: () => ScrollBodyType;
	useFriction: (input: number) => ScrollBodyType;
	useDuration: (input: number) => ScrollBodyType;
};

export const ScrollBody = (
	location: NumberStoreType,
	offsetLocation: NumberStoreType,
	previousLocation: NumberStoreType,
	target: NumberStoreType,
	baseDuration: number,
	baseFriction: number,
): ScrollBodyType => {
	let scrollVelocity = 0;
	let scrollDirection = 0;
	let scrollDuration = baseDuration;
	let scrollFriction = baseFriction;
	let rawLocation = location.get();
	let rawLocationPrevious = 0;

	const seek = (): ScrollBodyType => {
		const displacement = target.minus(location);
		const isInstant = !scrollDuration;
		let scrollDistance = 0;

		if (isInstant) {
			scrollVelocity = 0;
			previousLocation.set(target);
			location.set(target);

			scrollDistance = displacement;
		} else {
			previousLocation.set(location);

			scrollVelocity += displacement / scrollDuration;
			scrollVelocity *= scrollFriction;
			rawLocation += scrollVelocity;
			location.add(scrollVelocity);

			scrollDistance = rawLocation - rawLocationPrevious;
		}

		scrollDirection = Math.sign(scrollDistance);
		rawLocationPrevious = rawLocation;
		return self;
	};

	const settled = (): boolean => {
		const displacement = target.minus(offsetLocation);
		return Math.abs(displacement) < 0.001;
	};

	const duration = (): number => scrollDuration;

	const direction = (): number => scrollDirection;

	const velocity = (): number => scrollVelocity;

	const useBaseDuration = (): ScrollBodyType => useDuration(baseDuration);

	const useBaseFriction = (): ScrollBodyType => useFriction(baseFriction);

	const useDuration = (input: number): ScrollBodyType => {
		scrollDuration = input;
		return self;
	};

	const useFriction = (input: number): ScrollBodyType => {
		scrollFriction = input;
		return self;
	};

	const self: ScrollBodyType = {
		direction,
		duration,
		velocity,
		seek,
		settled,
		useBaseFriction,
		useBaseDuration,
		useFriction,
		useDuration,
	};
	return self;
};
