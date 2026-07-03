import { styleToString as serializeStyle } from 'overrule/props';

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

// Adapter over overrule's serializer: this one also passes strings through
// and tolerates null, the shapes floating-layer feeds it.
export function styleToString(style: string | StyleProperties | null | undefined = {}): string {
	if (!style) return '';
	if (typeof style === 'string') return style;
	return serializeStyle(style as Record<string, string | number | null | undefined>);
}

// Runs at module load, so it must not sit above `styleToString` (temporal
// dead zone → ReferenceError during SSR).
export const srOnlyStylesString = styleToString(srOnlyStyles);
