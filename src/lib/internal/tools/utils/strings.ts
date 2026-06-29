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

import type { StyleProperties } from '../types.js';

export const srOnlyStyles: StyleProperties = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: '0',
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0, 0, 0, 0)',
	whiteSpace: 'nowrap',
	borderWidth: '0',
	transform: 'translateX(-100%)',
};

function createParser(matcher: string | RegExp, replacer: (match: string) => string) {
	const regex = RegExp(matcher, 'g');
	return (str: string): string => {
		// throw an error if not a string
		if (typeof str !== 'string') {
			throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		}

		// if no match between string and matcher
		if (!str.match(regex)) return str;

		// executes the replacer function for each match
		return str.replace(regex, replacer);
	};
}

const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);

function styleToCSS(styleObj: object) {
	if (!styleObj || typeof styleObj !== 'object' || Array.isArray(styleObj)) {
		throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	}
	return Object.keys(styleObj)
		.map((property) => `${camelToKebab(property)}: ${styleObj[property as keyof typeof styleObj]};`)
		.join('\n');
}

export function styleToString(style: StyleProperties = {}): string {
	return styleToCSS(style).replace('\n', ' ');
}

// Initialized after `styleToString`/`camelToKebab` exist — it runs at module load, so it must
// not sit above the `const` helpers (temporal dead zone → ReferenceError during SSR).
export const srOnlyStylesString = styleToString(srOnlyStyles);
