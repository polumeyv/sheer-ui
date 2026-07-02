import type { StyleProperties } from '../types.js';

export const srOnlyStyles: StyleProperties = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: '0',
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0, 0, 0, 0)',
	clipPath: 'inset(50%)',
	whiteSpace: 'nowrap',
	borderWidth: '0',
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

export function styleToString(style: string | StyleProperties | null | undefined = {}): string {
	if (!style) return '';
	if (typeof style === 'string') return style;
	if (!style || typeof style !== 'object' || Array.isArray(style)) {
		throw new TypeError(`expected an argument of type object, but got ${typeof style}`);
	}
	return Object.keys(style)
		.map((property) => `${camelToKebab(property)}: ${style[property as keyof typeof style]};`)
		.join('\n')
		.replace('\n', ' ');
}

// Initialized after `styleToString`/`camelToKebab` exist — it runs at module load, so it must
// not sit above the `const` helpers (temporal dead zone → ReferenceError during SSR).
export const srOnlyStylesString = styleToString(srOnlyStyles);
