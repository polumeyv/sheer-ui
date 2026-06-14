export function linearScale(domain: [number, number], range: [number, number], clamp = true): (x: number) => number {
	const [d0, d1] = domain;
	const [r0, r1] = range;
	const slope = (r1 - r0) / (d1 - d0);
	const lo = Math.min(r0, r1);
	const hi = Math.max(r0, r1);

	return (x) => {
		const result = r0 + slope * (x - d0);
		if (!clamp) return result;
		return result > hi ? hi : result < lo ? lo : result;
	};
}
