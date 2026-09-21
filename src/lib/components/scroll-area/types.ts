import type { HTMLAttributes } from 'svelte/elements';
import type { WithElementRef } from '../../internal/utils.js';

export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover';

export type ScrollAreaRootProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	/**
	 * When the scrollbar shows: `auto` whenever the content overflows, `always` even when it does not,
	 * `scroll` only while scrolling, `hover` only while the pointer or focus is inside.
	 *
	 * @defaultValue "hover"
	 */
	type?: ScrollAreaType;

	/**
	 * Milliseconds the scrollbar stays visible after scrolling stops (`scroll`) or the pointer leaves (`hover`).
	 *
	 * @defaultValue 600
	 */
	scrollHideDelay?: number;

	/** @defaultValue "vertical" */
	orientation?: 'vertical' | 'horizontal' | 'both';
};
