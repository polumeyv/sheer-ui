import { BORDER_RADIUS, TRANSITIONS, WINDOW_TOP_OFFSET } from './internal/constants.js';
import { assignStyle, isVertical } from './helpers.js';
import { getDrawer } from './context.js';

export function useScaleBackground() {
	const ctx = getDrawer();
	let timeoutId: number | null = null;
	let initialBackgroundColor: string | undefined;

	const getScale = () => (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;

	$effect(() => {
		if (ctx.open.current && ctx.shouldScaleBackground.current) {
			initialBackgroundColor ??= document.body.style.backgroundColor;
			if (timeoutId) clearTimeout(timeoutId);
			const wrapper = document.querySelector<HTMLElement>('[data-vaul-drawer-wrapper]');

			if (!wrapper) return;

			// These styles are applied for good: upstream vaul chains their restore fns but discards
			// the chain, so the transition styles persist (the close animation needs them) and the
			// body background is restored by the timeout in the teardown below instead.
			if (ctx.setBackgroundColorOnScale.current && !ctx.noBodyStyles.current) assignStyle(document.body, { background: 'black' });
			assignStyle(wrapper, {
				transformOrigin: isVertical(ctx.direction.current) ? 'top' : 'left',
				transitionProperty: 'transform, border-radius',
				transitionDuration: `${TRANSITIONS.DURATION}s`,
				transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
			});

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
