const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ['-', '_', '/', '.'];

function isUppercase(char = ''): boolean | undefined {
	if (NUMBER_CHAR_RE.test(char)) return undefined;
	return char !== char.toLowerCase();
}

function splitByCase(str: string) {
	const parts: string[] = [];

	let buff = '';

	let previousUpper: boolean | undefined;
	let previousSplitter: boolean | undefined;

	for (const char of str) {
		// Splitter
		const isSplitter = STR_SPLITTERS.includes(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = '';
			previousUpper = undefined;
			continue;
		}

		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			// Case rising edge
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			// Case falling edge
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}

		// Normal char
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}

	parts.push(buff);

	return parts;
}

const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const pascalCase = (str?: string) =>
	splitByCase(str ?? '')
		.map(upperFirst)
		.join('');
export const camelCase = (str?: string) => lowerFirst(pascalCase(str ?? ''));
export const kebabCase = (str?: string) =>
	str
		? splitByCase(str)
				.map((p) => p.toLowerCase())
				.join('-')
		: '';
