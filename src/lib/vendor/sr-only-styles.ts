import type { StyleProperties } from './types';

/**
 * Visually-hidden (screen-reader-only) inline styles. Data, not logic — overrule
 * ships the style serializers (`styleToString`) but not this constant.
 */
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
