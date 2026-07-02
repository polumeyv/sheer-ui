export type AlignmentOptionType = 'start' | 'center' | 'end' | ((viewSize: number, snapSize: number, index: number) => number);

export type AlignmentType = {
	measure: (input: number, index: number) => number;
};

export const Alignment = (align: AlignmentOptionType, viewSize: number): AlignmentType => {
	const start = (): number => 0;

	const center = (input: number): number => end(input) / 2;

	const end = (input: number): number => viewSize - input;

	const predefined = { start, center, end };

	const measure = (input: number, index: number): number =>
		typeof align === 'string' ? predefined[align](input) : align(viewSize, input, index);

	const self: AlignmentType = {
		measure,
	};
	return self;
};
