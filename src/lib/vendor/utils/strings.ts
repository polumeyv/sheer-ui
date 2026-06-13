const STR_SPLITTERS = ['-', '_', '/', '.'];

function splitByCase(str: string): string[] {
	const parts: string[] = [];
	let buff = '';
	let prevUpper: boolean | undefined;

	for (const char of str) {
		if (STR_SPLITTERS.includes(char)) {
			if (buff) parts.push(buff);
			buff = '';
			prevUpper = undefined;
			continue;
		}

		const isUpper = char >= '0' && char <= '9' ? undefined : char !== char.toLowerCase();

		// rising edge: lower→Upper (fooBar → foo | Bar)
		if (prevUpper === false && isUpper) {
			if (buff) parts.push(buff);
			buff = char;
		}
		// falling edge: UPPER→lower with ≥2 buffered (XMLParser → XML | Parser)
		else if (prevUpper === true && !isUpper && buff.length > 1) {
			parts.push(buff.slice(0, -1));
			buff = buff.slice(-1) + char;
		}
		// normal
		else {
			buff += char;
		}

		prevUpper = isUpper;
	}

	if (buff) parts.push(buff);
	return parts;
}

export function pascalCase(str?: string): string {
	if (!str) return '';
	return splitByCase(str)
		.map((p) => p[0]!.toUpperCase() + p.slice(1))
		.join('');
}
export const camelCase = (str?: string) => ((str) => (str ? str[0]!.toLowerCase() + str.slice(1) : ''))(pascalCase(str || ''));
