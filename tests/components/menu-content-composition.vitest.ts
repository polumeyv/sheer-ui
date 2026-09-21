import { flushSync } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { mountInBody, unmount } from '../mount';
import MenuContentCompositionFixture from './menu-content-composition.fixture.svelte';

type Family = 'context-menu' | 'dropdown-menu' | 'menubar';

const families: { family: Family; dataSlot: string; minWidth: string; cssVar: string }[] = [
	{
		family: 'dropdown-menu',
		dataSlot: 'dropdown-menu-content',
		minWidth: 'min-w-32',
		cssVar: '--bits-dropdown-menu-content-transform-origin',
	},
	{
		family: 'context-menu',
		dataSlot: 'context-menu-content',
		minWidth: 'min-w-32',
		cssVar: '--bits-context-menu-content-transform-origin',
	},
	{ family: 'menubar', dataSlot: 'menubar-content', minWidth: 'min-w-48', cssVar: '--bits-menu-content-transform-origin' },
];

function render(props: { family: Family; isStatic?: boolean; onInteractOutside?: (e: PointerEvent) => void }) {
	return mountInBody(MenuContentCompositionFixture, props).component;
}

function getContent(dataSlot: string) {
	const node = document.body.querySelector<HTMLElement>(`[data-slot="${dataSlot}"]`);
	if (!node) throw new Error(`Expected ${dataSlot} to render`);
	return node;
}

function readOpen() {
	const node = document.body.querySelector('[data-testid="open"]');
	if (!node) throw new Error('Expected the open readout to render');
	return node.textContent;
}

describe('menu family Content composition', () => {
	test.each(families)('$family Content keeps its own slot, class and css vars', ({ family, dataSlot, minWidth, cssVar }) => {
		render({ family });

		const content = getContent(dataSlot);
		expect(content.className).toContain(minWidth);
		expect(content.getAttribute('style')).toContain(cssVar);
	});

	test.each(families)('$family Content is floating and ContentStatic is not', ({ family, dataSlot }) => {
		const floating = render({ family });

		expect(getContent(dataSlot).hasAttribute('data-floating-content')).toBe(true);
		unmount(floating);

		render({ family, isStatic: true });

		expect(getContent(dataSlot).hasAttribute('data-floating-content')).toBe(false);
	});

	test.each(families)('$family closes on Escape in both Content variants', ({ family }) => {
		for (const isStatic of [false, true]) {
			const component = render({ family, isStatic });

			expect(readOpen()).toBe('true');

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
			flushSync();

			expect(readOpen()).toBe('false');
			unmount(component);
		}
	});

	// The one place the shared implementation branches on the family: the engine's
	// handleInteractOutside defers (preventDefault) an outside pointerdown that lands on the menu's
	// own trigger — the trigger's own pointerdown toggles, so the layer must not also close — and a
	// deferred event never reaches the consumer's onInteractOutside. A context-menu trigger is the
	// whole right-clickable region, so it must skip that deferral and let the event through.
	describe('outside pointerdown on the own trigger', () => {
		afterEach(() => vi.useRealTimers());

		function pointerDownOnTrigger() {
			vi.advanceTimersByTime(1); // the layer's registration gate...
			flushSync(); // ...and the microtask `on()` defers its listener attachment to
			const trigger = document.body.querySelector<HTMLElement>('[data-testid="trigger"]');
			if (!trigger) throw new Error('Expected the trigger to render');
			trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, clientX: 5, clientY: 5 }));
			vi.advanceTimersByTime(10); // the dismissible layer's interact-outside debounce
			flushSync();
		}

		test.each(['dropdown-menu', 'menubar'] as const)('%s defers it: onInteractOutside is not reached', (family) => {
			vi.useFakeTimers();
			const onInteractOutside = vi.fn();
			render({ family, onInteractOutside });
			pointerDownOnTrigger();
			expect(onInteractOutside).not.toHaveBeenCalled();
		});

		test('context-menu lets it through: onInteractOutside is reached and the menu closes', () => {
			vi.useFakeTimers();
			const onInteractOutside = vi.fn();
			render({ family: 'context-menu', onInteractOutside });
			pointerDownOnTrigger();
			expect(onInteractOutside).toHaveBeenCalledOnce();
			expect(readOpen()).toBe('false');
		});
	});
});
