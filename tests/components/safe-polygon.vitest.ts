import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import SafePolygonFixture from './safe-polygon.fixture.svelte';

function rect(left: number, top: number, right: number, bottom: number) {
	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top,
		x: left,
		y: top,
		toJSON() {
			return this;
		},
	};
}

function render() {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(SafePolygonFixture, { target }) as unknown as {
		setEnabled: (value: boolean) => void;
	};
	flushSync();

	const trigger = target.querySelector<HTMLElement>('[data-testid="trigger"]');
	const content = target.querySelector<HTMLElement>('[data-testid="content"]');
	if (!trigger || !content) throw new Error('Expected trigger and content to render');

	// trigger at [0,0]-[50,20]; content to its right, with a 50px horizontal gap, at [100,0]-[200,100]
	vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 50, 20));
	vi.spyOn(content, 'getBoundingClientRect').mockReturnValue(rect(100, 0, 200, 100));

	function exitCount() {
		return Number(target.querySelector('[data-testid="exit-count"]')?.textContent);
	}

	function pointerMove(clientX: number, clientY: number) {
		document.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true }));
		flushSync();
	}

	return { component, target, trigger, content, exitCount, pointerMove };
}

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

describe('SafePolygon', () => {
	test('leaving the trigger directly toward the content does not start tracking (no exit call)', () => {
		const { component, trigger, content, exitCount, pointerMove } = render();
		try {
			trigger.dispatchEvent(new PointerEvent('pointerleave', { clientX: 45, clientY: 10, relatedTarget: content, bubbles: true }));
			flushSync();
			// no exit should ever fire without any tracked movement
			pointerMove(150, 50);
			expect(exitCount()).toBe(0);
		} finally {
			unmount(component);
		}
	});

	test('moving from the trigger through the safe zone into the content does not close', () => {
		const { component, trigger, content, exitCount, pointerMove } = render();
		try {
			// leave trigger heading roughly toward content, but not landing on it directly (relatedTarget = document body)
			trigger.dispatchEvent(new PointerEvent('pointerleave', { clientX: 50, clientY: 10, relatedTarget: document.body, bubbles: true }));
			flushSync();

			// move along a straight line from the exit point toward content — squarely inside both
			// the corridor (the trigger-content gap) and the safe-zone cone
			pointerMove(90, 10);
			expect(exitCount()).toBe(0);

			content.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
			flushSync();
			expect(exitCount()).toBe(0);
		} finally {
			unmount(component);
		}
	});

	test('moving away from both trigger and content closes', () => {
		const { component, trigger, exitCount, pointerMove } = render();
		try {
			trigger.dispatchEvent(new PointerEvent('pointerleave', { clientX: 50, clientY: 10, relatedTarget: document.body, bubbles: true }));
			flushSync();

			// move far in the opposite direction of content -- well outside any safe zone or corridor
			pointerMove(-500, -500);
			expect(exitCount()).toBe(1);
		} finally {
			unmount(component);
		}
	});

	test('disabling mid-track clears tracking so a subsequent stray move does not fire a stale exit', () => {
		const { component, trigger, exitCount, pointerMove } = render();
		try {
			trigger.dispatchEvent(new PointerEvent('pointerleave', { clientX: 50, clientY: 10, relatedTarget: document.body, bubbles: true }));
			flushSync();

			component.setEnabled(false);
			flushSync();

			pointerMove(-500, -500);
			expect(exitCount()).toBe(0);
		} finally {
			unmount(component);
		}
	});
});
