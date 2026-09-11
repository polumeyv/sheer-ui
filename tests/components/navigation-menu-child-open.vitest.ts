import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Fixture from './navigation-menu-child-open.fixture.svelte';

// Content stays mounted and hidden inline while closed; `child` receives `open`, so a consumer
// can own the `{#if}` (and a Svelte `transition:`) while the library keeps supplying props.

function render(viewport: boolean) {
	const target = document.createElement('div');
	document.body.append(target);
	const component = mount(Fixture, { target, props: { viewport } });
	flushSync();
	const trigger = target.querySelector<HTMLElement>('[data-testid="trigger"]')!;
	const content = () => document.querySelector<HTMLElement>('[data-testid="content"]');
	return { component, trigger, content };
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('NavigationMenu presence', () => {
	test('default content is mounted while closed and hidden inline', () => {
		const { component } = render(false);
		const two = document.querySelector<HTMLElement>('[data-testid="content-two"]')!;
		expect(two.dataset.state).toBe('closed');
		expect(two.style.visibility).toBe('hidden');
		unmount(component);
	});

	test('child content exists only while open and carries the library props', () => {
		const { component, trigger, content } = render(false);
		expect(content()).toBeNull();

		trigger.click();
		flushSync();
		const el = content()!;
		expect(el.dataset.state).toBe('open');
		expect(el.getAttribute('aria-labelledby')).toBe(trigger.id);

		trigger.click();
		flushSync();
		expect(content()).toBeNull();
		unmount(component);
	});

	test('viewport child follows open and hosts the portaled content', () => {
		const { component, trigger, content } = render(true);
		const viewport = () => document.querySelector<HTMLElement>('[data-testid="viewport"]');
		expect(viewport()).toBeNull();

		trigger.click();
		flushSync();
		expect(viewport()?.dataset.state).toBe('open');
		expect(viewport()!.contains(content())).toBe(true);

		trigger.click();
		flushSync();
		expect(viewport()).toBeNull();
		expect(content()).toBeNull();
		unmount(component);
	});
});

// jsdom has no PointerEvent constructor with pointerType; the handlers only read that field.
function pointer(el: HTMLElement, type: 'pointermove' | 'pointerleave') {
	const e = new MouseEvent(type, { bubbles: true, cancelable: true });
	Object.defineProperty(e, 'pointerType', { value: 'mouse' });
	el.dispatchEvent(e);
	flushSync();
}

function tick(ms: number) {
	vi.advanceTimersByTime(ms);
	flushSync();
}

describe('NavigationMenu hover delay', () => {
	// Defaults: delayDuration 200, skipDelayDuration 300, 150 while open.
	test('a hover within skipDelayDuration of a close skips delayDuration', () => {
		vi.useFakeTimers();
		const target = document.createElement('div');
		document.body.append(target);
		const component = mount(Fixture, { target, props: { openOnHover: true } });
		flushSync();
		const one = target.querySelector<HTMLElement>('[data-testid="trigger"]')!;
		const two = target.querySelector<HTMLElement>('[data-testid="trigger-two"]')!;
		const contentTwo = target.querySelector<HTMLElement>('[data-testid="content-two"]')!;
		const content = () => document.querySelector<HTMLElement>('[data-testid="content"]');

		pointer(one, 'pointermove');
		tick(199);
		expect(content()).toBeNull();
		tick(1);
		expect(content()).not.toBeNull();

		pointer(one, 'pointerleave');
		tick(150);
		expect(content()).toBeNull();

		pointer(two, 'pointermove');
		tick(150);
		expect(contentTwo.dataset.state).toBe('open');

		pointer(two, 'pointerleave');
		tick(150);
		expect(contentTwo.dataset.state).toBe('closed');
		tick(300);

		pointer(one, 'pointermove');
		tick(150);
		expect(content()).toBeNull();
		tick(50);
		expect(content()).not.toBeNull();

		unmount(component);
		vi.useRealTimers();
	});
});
