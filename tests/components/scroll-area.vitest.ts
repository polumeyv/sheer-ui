import { flushSync, type ComponentProps } from 'svelte';
import { expect, test, vi } from 'vitest';
import { mountInBody } from '../mount';
import { Root } from '#lib/components/scroll-area/index.js';

function render(props: ComponentProps<typeof Root> = {}) {
	return mountInBody(Root, props).target.querySelector<HTMLDivElement>('[data-slot="scroll-area"]')!;
}

test('defaults carry the hover type, vertical orientation and a 600ms hide delay', () => {
	const el = render();
	expect(el.dataset.type).toBe('hover');
	expect(el.dataset.orientation).toBe('vertical');
	expect(el.style.getPropertyValue('--scroll-hide-delay')).toBe('600ms');
	expect(el.hasAttribute('data-scrolling')).toBe(false);
});

test('type, orientation and scrollHideDelay reach the element the stylesheet keys on', () => {
	const el = render({ type: 'scroll', orientation: 'both', scrollHideDelay: 2000 });
	expect(el.dataset.type).toBe('scroll');
	expect(el.dataset.orientation).toBe('both');
	expect(el.style.getPropertyValue('--scroll-hide-delay')).toBe('2000ms');
});

test('data-scrolling is present from scroll until scrollend', () => {
	const el = render({ type: 'scroll' });
	el.dispatchEvent(new Event('scroll'));
	flushSync();
	expect(el.hasAttribute('data-scrolling')).toBe(true);
	el.dispatchEvent(new Event('scrollend'));
	flushSync();
	expect(el.hasAttribute('data-scrolling')).toBe(false);
});

test("a consumer's onscroll still runs beside the tracking handler", () => {
	const onscroll = vi.fn();
	const el = render({ type: 'scroll', onscroll });
	el.dispatchEvent(new Event('scroll'));
	flushSync();
	expect(onscroll).toHaveBeenCalledOnce();
	expect(el.hasAttribute('data-scrolling')).toBe(true);
});

test('consumer classes merge with the focus ring', () => {
	const el = render({ class: 'h-72 w-48' });
	expect(el.className).toContain('h-72');
	expect(el.className).toContain('focus-visible:ring-4');
});
