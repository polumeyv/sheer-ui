import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './internal/constants.js';
import { assignStyle, isVertical } from './helpers.js';
import { executeCallbacks } from '$lib/internal/tools/index.js';
import { noop } from '@polumeyv/utilities';
import { getDrawer } from './context.js';

export function useScaleBackground() {
	const ctx = getDrawer();
	let timeoutId: number | null = null;
	const initialBackgroundColor = typeof document !== 'undefined' ? document.body.style.backgroundColor : '';

	const getScale = () => (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;

	$effect(() => {
		ctx.open.current;
		ctx.shouldScaleBackground.current;
		ctx.setBackgroundColorOnScale.current;
		if (ctx.open.current && ctx.shouldScaleBackground.current) {
			if (timeoutId) clearTimeout(timeoutId);
			const wrapper =
				(document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement) ||
				(document.querySelector('[data-vaul-drawer-wrapper]') as HTMLElement);

			if (!wrapper) return;

			executeCallbacks(
				ctx.setBackgroundColorOnScale.current && !ctx.noBodyStyles.current ? assignStyle(document.body, { background: 'black' }) : noop,
				assignStyle(wrapper, {
					transformOrigin: isVertical(ctx.direction.current) ? 'top' : 'left',
					transitionProperty: 'transform, border-radius',
					transitionDuration: `${TRANSITIONS.DURATION}s`,
					transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
				}),
			);

			const wrapperStylesCleanup = assignStyle(wrapper, {
				borderRadius: `${BORDER_RADIUS}px`,
				overflow: 'hidden',
				...(isVertical(ctx.direction.current)
					? {
							transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
						}
					: {
							transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
						}),
			});

			return () => {
				wrapperStylesCleanup();
				timeoutId = window.setTimeout(
					() =>
						initialBackgroundColor
							? (document.body.style.background = initialBackgroundColor)
							: document.body.style.removeProperty('background'),
					TRANSITIONS.DURATION * 1000,
				);
			};
		}
	});
}
