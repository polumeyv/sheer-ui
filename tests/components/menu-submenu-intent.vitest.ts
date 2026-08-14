import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import MenuSubmenuIntentFixture from './menu-submenu-intent.fixture.svelte';

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

function pointerEvent(type: string, clientX: number, clientY: number, extra: PointerEventInit = {}) {
	return new PointerEvent(type, { clientX, clientY, pointerType: 'mouse', bubbles: true, ...extra });
}

function render(ownerDocument = document) {
	const target = ownerDocument.createElement('div');
	ownerDocument.body.append(target);
	const component = mount(MenuSubmenuIntentFixture, { target }) as unknown as {
		setEnabled: (value: boolean) => void;
	};
	flushSync();

	const trigger = target.querySelector<HTMLElement>('[data-testid="trigger"]');
	const content = target.querySelector<HTMLElement>('[data-testid="content"]');
	if (!trigger || !content) throw new Error('Expected trigger and content to render');

	// trigger at [0,0]-[50,20]; submenu content to its right, with a gap, at [100,0]-[200,100]
	vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 50, 20));
	vi.spyOn(content, 'getBoundingClientRect').mockReturnValue(rect(100, 0, 200, 100));
	// jsdom doesn't define elementFromPoint at all (needs real layout), so vi.spyOn can't wrap it --
	// #isPointerInDescendantSubContent uses it purely to check for a deeper nested submenu under the
	// cursor, which none of these tests exercise, so "nothing there" is the correct stand-in.
	ownerDocument.elementFromPoint = vi.fn().mockReturnValue(null);

	function exitCount() {
		return Number(target.querySelector('[data-testid="exit-count"]')?.textContent);
	}
	function inTransit() {
		return target.querySelector('[data-testid="in-transit"]')?.textContent === 'true';
	}
	function docPointerMove(clientX: number, clientY: number) {
		ownerDocument.dispatchEvent(pointerEvent('pointermove', clientX, clientY));
		flushSync();
	}
	function engageTowardContent() {
		// leave the trigger heading toward the gap between it and content, landing on neither directly
		trigger.dispatchEvent(pointerEvent('pointerleave', 55, 10, { relatedTarget: document.body }));
		flushSync();
	}

	return { component, target, trigger, content, exitCount, inTransit, docPointerMove, engageTowardContent };
}

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe('MenuSubmenuIntent', () => {
	test('leaving the trigger toward the content safe zone engages tracking (pointer marked in-transit)', () => {
		const { component, inTransit } = render();
		try {
			// nothing engaged yet
			expect(inTransit()).toBe(false);
		} finally {
			unmount(component);
		}
	});

	test('engaging via trigger-leave, then a doc pointermove still inside the safe zone does not exit', () => {
		const { component, engageTowardContent, docPointerMove, exitCount, inTransit } = render();
		try {
			engageTowardContent();
			expect(inTransit()).toBe(true);

			// still on the way toward content, inside the corridor
			docPointerMove(80, 10);
			expect(exitCount()).toBe(0);
			expect(inTransit()).toBe(true);
		} finally {
			unmount(component);
		}
	});

	test('a doc pointermove that reaches the content rect disengages without calling onIntentExit', () => {
		const { component, engageTowardContent, docPointerMove, exitCount, inTransit } = render();
		try {
			engageTowardContent();
			docPointerMove(150, 50); // squarely inside content
			expect(exitCount()).toBe(0);
			expect(inTransit()).toBe(false);
		} finally {
			unmount(component);
		}
	});

	test('a doc pointermove far outside the safe zone calls onIntentExit and clears in-transit immediately', () => {
		const { component, engageTowardContent, docPointerMove, exitCount, inTransit } = render();
		try {
			engageTowardContent();
			docPointerMove(-500, -500);
			expect(exitCount()).toBe(1);
			expect(inTransit()).toBe(false);
		} finally {
			unmount(component);
		}
	});

	test('disabling mid-track resets state so a subsequent stray doc pointermove does not fire a stale exit', () => {
		const { component, engageTowardContent, docPointerMove, exitCount, inTransit } = render();
		try {
			engageTowardContent();
			expect(inTransit()).toBe(true);

			component.setEnabled(false);
			flushSync();
			expect(inTransit()).toBe(false);

			docPointerMove(-500, -500);
			expect(exitCount()).toBe(0);
		} finally {
			unmount(component);
		}
	});

		test('tracks submenu intent on the trigger owning document', () => {
		const iframe = document.createElement('iframe');
		document.body.append(iframe);
		const foreignDocument = iframe.contentDocument;
		if (!foreignDocument) throw new Error('Expected iframe document');

		const { component, engageTowardContent, docPointerMove, exitCount } = render(foreignDocument);
		try {
			engageTowardContent();
			document.dispatchEvent(pointerEvent('pointermove', -500, -500));
			flushSync();
			expect(exitCount()).toBe(0);

			docPointerMove(-500, -500);
			expect(exitCount()).toBe(1);
		} finally {
			unmount(component);
			iframe.remove();
		}
	});
});
