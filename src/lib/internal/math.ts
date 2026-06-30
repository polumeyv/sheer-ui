export const linearScale = ([d0, d1]: [number, number], [r0, r1]: [number, number], clamp = true) => {
	const slope = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
	const min = Math.min(r0, r1);
	const max = Math.max(r0, r1);

	return (x: number) => {
		const value = r0 + slope * (x - d0);

		return clamp ? Math.min(max, Math.max(min, value)) : value;
	};
};
